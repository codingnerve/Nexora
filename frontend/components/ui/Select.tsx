"use client";

import { ChevronDown } from "lucide-react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { cn } from "@/utils/cn";
import {
  CONTROL_HEIGHT,
  FormField,
  controlClassName,
} from "@/components/ui/FormField";

/**
 * Select.
 *
 * This is a **native** `<select>` with the browser chevron replaced.
 *
 * A custom listbox was considered and rejected: on mobile the native control
 * opens the OS picker, which is faster to operate and already handles
 * type-ahead, screen readers and hardware keyboards correctly. None of the
 * option lists in this product (trip type, cabin class, vehicle type) need
 * search, multi-select, icons or grouping, so a custom widget would cost
 * accessibility and gain nothing.
 */

export interface SelectOption {
  readonly value: string;
  readonly label: string;
  readonly disabled?: boolean;
}

export interface SelectProps
  extends Omit<ComponentPropsWithoutRef<"select">, "className" | "id" | "children"> {
  label: string;
  options: readonly SelectOption[];
  /** Rendered as a disabled empty-value option shown before a choice is made. */
  placeholder?: string;
  helper?: ReactNode;
  error?: string;
  className?: string;
  fieldClassName?: string;
}

export function Select({
  label,
  options,
  placeholder,
  helper,
  error,
  required,
  className,
  fieldClassName,
  ...rest
}: SelectProps) {
  return (
    <FormField
      label={label}
      helper={helper}
      error={error}
      required={required}
      className={fieldClassName}
    >
      {({ id, describedBy, invalid }) => (
        <div className="relative">
          <select
            id={id}
            required={required}
            aria-required={required || undefined}
            aria-invalid={invalid || undefined}
            aria-describedby={describedBy}
            className={cn(
              "nx-select",
              controlClassName(invalid),
              CONTROL_HEIGHT,
              // Remove the platform chevron; ours is drawn below.
              "cursor-pointer appearance-none pr-11",
              className
            )}
            {...rest}
          >
            {placeholder ? (
              <option value="" disabled>
                {placeholder}
              </option>
            ) : null}

            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </select>

          <ChevronDown
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2",
              invalid ? "text-danger-600" : "text-stone-500"
            )}
          />
        </div>
      )}
    </FormField>
  );
}
