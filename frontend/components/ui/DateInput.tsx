"use client";

import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { cn } from "@/utils/cn";
import {
  CONTROL_HEIGHT,
  FormField,
  controlClassName,
} from "@/components/ui/FormField";

/**
 * Date input.
 *
 * Uses the **native** `<input type="date">` rather than a bespoke calendar.
 * The native control already gives us a real OS date picker on mobile, full
 * keyboard entry on desktop, locale-correct formatting, and screen-reader
 * support — all of which a hand-built popover calendar would have to
 * reimplement and would likely get wrong.
 *
 * What this wrapper adds is the parts the native control does not give us:
 * a brand-consistent frame, a sensible `min` default of today (nobody books
 * travel into the past), and the shared label/helper/error structure.
 */

/** Today as `YYYY-MM-DD` in the visitor's local timezone, not UTC. */
export function todayISO(): string {
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 10);
}

/** Adds `days` to an ISO date string, e.g. for a minimum return date. */
export function addDaysISO(iso: string, days: number): string {
  const date = new Date(`${iso}T00:00:00`);
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

/**
 * Formats an ISO date for display in summaries and emails, e.g.
 * "Fri, 24 Apr 2026". Returns an empty string for an unset or invalid value.
 */
export function formatDisplayDate(iso: string | undefined): string {
  if (!iso) return "";
  const date = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export interface DateInputProps
  extends Omit<
    ComponentPropsWithoutRef<"input">,
    "className" | "id" | "type"
  > {
  label: string;
  helper?: ReactNode;
  error?: string;
  /** Defaults to today. Pass an explicit value to widen or narrow the range. */
  min?: string;
  className?: string;
  fieldClassName?: string;
}

export function DateInput({
  label,
  helper,
  error,
  required,
  min,
  className,
  fieldClassName,
  ...rest
}: DateInputProps) {
  return (
    <FormField
      label={label}
      helper={helper}
      error={error}
      required={required}
      className={fieldClassName}
    >
      {({ id, describedBy, invalid }) => (
        <input
          id={id}
          type="date"
          min={min ?? todayISO()}
          required={required}
          aria-required={required || undefined}
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy}
          className={cn(
            controlClassName(invalid),
            CONTROL_HEIGHT,
            "nx-figures",
            // Safari renders date fields with an intrinsic width; override it.
            "min-w-0 [&::-webkit-date-and-time-value]:text-left",
            className
          )}
          {...rest}
        />
      )}
    </FormField>
  );
}

/**
 * Time input. Same reasoning as the date field — the native control is the
 * accessible and mobile-friendly choice.
 */
export interface TimeInputProps
  extends Omit<
    ComponentPropsWithoutRef<"input">,
    "className" | "id" | "type"
  > {
  label: string;
  helper?: ReactNode;
  error?: string;
  className?: string;
  fieldClassName?: string;
}

export function TimeInput({
  label,
  helper,
  error,
  required,
  className,
  fieldClassName,
  ...rest
}: TimeInputProps) {
  return (
    <FormField
      label={label}
      helper={helper}
      error={error}
      required={required}
      className={fieldClassName}
    >
      {({ id, describedBy, invalid }) => (
        <input
          id={id}
          type="time"
          required={required}
          aria-required={required || undefined}
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy}
          className={cn(
            controlClassName(invalid),
            CONTROL_HEIGHT,
            "nx-figures min-w-0",
            className
          )}
          {...rest}
        />
      )}
    </FormField>
  );
}
