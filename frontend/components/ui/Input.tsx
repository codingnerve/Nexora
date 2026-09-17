"use client";

import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { cn } from "@/utils/cn";
import {
  CONTROL_HEIGHT,
  FormField,
  controlClassName,
} from "@/components/ui/FormField";

/**
 * Single-line text input.
 *
 * `type` is passed straight through so callers can use `email`, `tel` and
 * `url` — these select the correct mobile keyboard, which matters more on a
 * travel form filled in on a phone than any styling choice.
 */
export interface InputProps
  extends Omit<ComponentPropsWithoutRef<"input">, "className" | "id"> {
  label: string;
  helper?: ReactNode;
  error?: string;
  /** Small glyph shown inside the field, e.g. a location or search marker. */
  icon?: ReactNode;
  className?: string;
  fieldClassName?: string;
}

export function Input({
  label,
  helper,
  error,
  icon,
  required,
  className,
  fieldClassName,
  ...rest
}: InputProps) {
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
          {icon ? (
            <span
              aria-hidden="true"
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500 [&>svg]:size-[1.125rem]"
            >
              {icon}
            </span>
          ) : null}

          <input
            id={id}
            required={required}
            aria-required={required || undefined}
            aria-invalid={invalid || undefined}
            aria-describedby={describedBy}
            className={cn(
              controlClassName(invalid),
              CONTROL_HEIGHT,
              icon && "pl-11",
              className
            )}
            {...rest}
          />
        </div>
      )}
    </FormField>
  );
}

/**
 * Multi-line input for "additional requirements" and message fields.
 * Resizes vertically only — horizontal resize breaks the form grid.
 */
export interface TextareaProps
  extends Omit<ComponentPropsWithoutRef<"textarea">, "className" | "id"> {
  label: string;
  helper?: ReactNode;
  error?: string;
  className?: string;
  fieldClassName?: string;
}

export function Textarea({
  label,
  helper,
  error,
  required,
  rows = 4,
  className,
  fieldClassName,
  ...rest
}: TextareaProps) {
  return (
    <FormField
      label={label}
      helper={helper}
      error={error}
      required={required}
      className={fieldClassName}
    >
      {({ id, describedBy, invalid }) => (
        <textarea
          id={id}
          rows={rows}
          required={required}
          aria-required={required || undefined}
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy}
          className={cn(
            controlClassName(invalid),
            "resize-y py-3 leading-relaxed",
            className
          )}
          {...rest}
        />
      )}
    </FormField>
  );
}
