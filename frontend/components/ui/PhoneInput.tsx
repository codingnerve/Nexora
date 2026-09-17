"use client";

import { ChevronDown } from "lucide-react";
import { useState, type ChangeEvent } from "react";

import { cn } from "@/utils/cn";
import { CONTROL_HEIGHT, FormField } from "@/components/ui/FormField";
import { DEFAULT_DIAL_ISO, DIAL_CODES, findDialCode } from "@/lib/countries";

/**
 * Customer phone input: a country dialling code picker joined to a number
 * field.
 *
 * This is the **customer's** number. It is deliberately unrelated to the
 * company's toll-free number, which lives in `<CallToBook />` and is never
 * entered by a user.
 *
 * No national format is assumed or enforced. Digit grouping varies by country
 * and guessing wrong would reject valid numbers, so validation only checks
 * that enough digits are present — the travel team will read it, not a
 * switchboard.
 */

/** Strips everything except digits, used before length checks and submission. */
export const digitsOnly = (value: string): string => value.replace(/\D/g, "");

/** Minimum national-number length that is plausible anywhere. */
const MIN_DIGITS = 6;
const MAX_DIGITS = 15;

export function isPlausiblePhone(nationalNumber: string): boolean {
  const digits = digitsOnly(nationalNumber);
  return digits.length >= MIN_DIGITS && digits.length <= MAX_DIGITS;
}

/** Combines the picker and field into the E.164-style value we submit. */
export function composePhone(dialIso: string, nationalNumber: string): string {
  const dial = findDialCode(dialIso)?.dial ?? "";
  const digits = digitsOnly(nationalNumber);
  return dial && digits ? `${dial} ${digits}` : digits;
}

export interface PhoneInputProps {
  label?: string;
  helper?: string;
  error?: string;
  required?: boolean;
  /** Name of the hidden field carrying the combined value on submit. */
  name?: string;
  defaultDialIso?: string;
  defaultNumber?: string;
  /** Fires with the combined value, e.g. "+44 7700900123". */
  onChange?: (combined: string, parts: { dialIso: string; number: string }) => void;
  onBlur?: () => void;
  className?: string;
}

export function PhoneInput({
  label = "Phone",
  helper,
  error,
  required,
  name = "phone",
  defaultDialIso = DEFAULT_DIAL_ISO,
  defaultNumber = "",
  onChange,
  onBlur,
  className,
}: PhoneInputProps) {
  const [dialIso, setDialIso] = useState(defaultDialIso);
  const [number, setNumber] = useState(defaultNumber);

  const emit = (nextIso: string, nextNumber: string) => {
    onChange?.(composePhone(nextIso, nextNumber), {
      dialIso: nextIso,
      number: nextNumber,
    });
  };

  const handleDialChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setDialIso(event.target.value);
    emit(event.target.value, number);
  };

  const handleNumberChange = (event: ChangeEvent<HTMLInputElement>) => {
    // Allow digits, spaces and separators while typing; normalise on submit.
    const next = event.target.value.replace(/[^\d\s()+-]/g, "");
    setNumber(next);
    emit(dialIso, next);
  };

  return (
    <FormField
      label={label}
      helper={helper}
      error={error}
      required={required}
      className={className}
    >
      {({ id, describedBy, invalid }) => (
        <>
          {/* One visual control made of two real inputs, joined by a shared
              border so it reads as a single field. */}
          <div
            className={cn(
              "flex items-stretch rounded-[8px] border bg-white",
              "transition-[border-color,box-shadow] duration-200",
              "ease-[cubic-bezier(0.22,1,0.36,1)]",
              invalid
                ? "border-danger-600 focus-within:shadow-[0_0_0_4px_rgb(180_35_24/0.12)]"
                : cn(
                    "border-sand-400 hover:border-stone-400",
                    "focus-within:border-clay-500",
                    "focus-within:shadow-[0_0_0_4px_rgb(231_111_81/0.18)]"
                  ),
              CONTROL_HEIGHT
            )}
          >
            {/* Fixed width: a native <select> otherwise sizes itself to its
                longest option ("+971 United Arab Emirates") and squeezes the
                number field to a few pixels on phones. Only the dial code shows
                when closed; the full country names show in the open list. */}
            <div className="relative w-[5.75rem] shrink-0">
              <select
                value={dialIso}
                onChange={handleDialChange}
                onBlur={onBlur}
                // The visible label belongs to the number field, so the picker
                // carries its own accessible name.
                aria-label="Country dialling code"
                className={cn(
                  "nx-select nx-figures h-full w-full cursor-pointer appearance-none",
                  "overflow-hidden rounded-l-[8px] border-0 bg-transparent py-0 pl-3 pr-7",
                  "text-body-md text-ink-900 focus:outline-none focus-visible:outline-none",
                  // The wrapper draws the field's focus ring, but each segment
                  // also tints so it is clear which half currently has focus.
                  "transition-colors duration-[180ms] focus-visible:bg-clay-500/[0.08]"
                )}
              >
                <option value="">Code</option>
                {/* Six non-breaking spaces push the country name past the closed
                    control's edge, so only the dial code is visible. */}
                {DIAL_CODES.map((country) => (
                  <option key={country.iso} value={country.iso}>
                    {`${country.dial}${" ".repeat(6)}${country.name}`}
                  </option>
                ))}
              </select>

              <ChevronDown
                aria-hidden="true"
                className="pointer-events-none absolute right-2 top-1/2 size-4 -translate-y-1/2 text-stone-500"
              />
            </div>

            {/* The divider is the only thing separating the two controls. */}
            <span aria-hidden="true" className="my-2.5 w-px shrink-0 bg-sand-300" />

            <input
              id={id}
              type="tel"
              inputMode="tel"
              autoComplete="tel-national"
              value={number}
              onChange={handleNumberChange}
              onBlur={onBlur}
              required={required}
              aria-required={required || undefined}
              aria-invalid={invalid || undefined}
              aria-describedby={describedBy}
              placeholder="Your contact number"
              className={cn(
                "nx-figures h-full min-w-0 flex-1 rounded-r-[8px] border-0",
                "bg-transparent px-3.5 text-body-md text-ink-900",
                "placeholder:font-sans placeholder:text-stone-400",
                "focus:outline-none focus-visible:outline-none",
                "transition-colors duration-[180ms] focus-visible:bg-clay-500/[0.08]"
              )}
            />
          </div>

          {/* Submitted value — a single normalised string for the backend. */}
          <input type="hidden" name={name} value={composePhone(dialIso, number)} />
        </>
      )}
    </FormField>
  );
}
