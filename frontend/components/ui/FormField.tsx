"use client";

import { CircleAlert } from "lucide-react";
import { useId, type ReactNode } from "react";

import { cn } from "@/utils/cn";

/**
 * The shared field structure: label → control → helper → error.
 *
 * Every input in the product goes through this wrapper, so spacing, label
 * styling and error presentation can never drift between forms.
 *
 * Accessibility contract handled here once:
 *   - the label is always visible and bound via `htmlFor`
 *   - helper and error text are wired to the control with `aria-describedby`
 *   - errors carry `role="alert"` so a screen reader announces them on change
 *   - an error is signalled by an icon and text, never by colour alone
 */

export interface FieldRenderProps {
  id: string;
  describedBy: string | undefined;
  invalid: boolean;
}

export function FormField({
  label,
  helper,
  error,
  required = false,
  optionalLabel = true,
  className,
  children,
}: {
  label: string;
  helper?: ReactNode;
  error?: string;
  required?: boolean;
  /** Show a muted "Optional" tag when the field is not required. */
  optionalLabel?: boolean;
  className?: string;
  children: (props: FieldRenderProps) => ReactNode;
}) {
  const reactId = useId();
  const id = `field-${reactId}`;
  const helperId = `${id}-helper`;
  const errorId = `${id}-error`;

  const describedBy =
    [error ? errorId : null, helper ? helperId : null]
      .filter(Boolean)
      .join(" ") || undefined;

  return (
    <div className={cn("flex flex-col", className)}>
      <div className="mb-1.5 flex items-baseline justify-between gap-3">
        <label
          htmlFor={id}
          className="text-[0.875rem] font-semibold text-ink-900"
        >
          {label}
          {required ? (
            <>
              <span aria-hidden="true" className="ml-0.5 text-clay-700">
                *
              </span>
              <span className="sr-only"> (required)</span>
            </>
          ) : null}
        </label>

        {!required && optionalLabel ? (
          <span className="shrink-0 text-caption text-stone-500">Optional</span>
        ) : null}
      </div>

      {children({ id, describedBy, invalid: Boolean(error) })}

      {helper && !error ? (
        <p id={helperId} className="mt-2 text-caption text-stone-500">
          {helper}
        </p>
      ) : null}

      {error ? (
        <p
          id={errorId}
          role="alert"
          className="mt-2 flex items-start gap-1.5 text-caption font-medium text-danger-600"
        >
          <CircleAlert aria-hidden="true" className="mt-px size-3.5 shrink-0" />
          <span>{error}</span>
        </p>
      ) : null}
    </div>
  );
}

/**
 * Shared control styling.
 *
 * White field, a thin grey border and an 8px radius
 * — calm next to the 10px buttons. The focus state is a coral border plus a soft
 * ring — clearly visible without the heavy blue glow of a default form control.
 */
export const controlClassName = (invalid?: boolean): string =>
  cn(
    "w-full rounded-[8px] border bg-white px-3.5 text-body-md text-ink-900",
    "placeholder:text-stone-400",
    "transition-[border-color,box-shadow] duration-200",
    "ease-[cubic-bezier(0.22,1,0.36,1)]",
    // The focus ring is a box-shadow so it follows the corner radius exactly.
    "focus:outline-none focus-visible:outline-none",
    invalid
      ? "border-danger-600 focus:border-danger-600 focus:shadow-[0_0_0_4px_rgb(180_35_24/0.12)]"
      : "border-sand-400 hover:border-stone-400 focus:border-clay-500 focus:shadow-[0_0_0_4px_rgb(231_111_81/0.18)]",
    "disabled:cursor-not-allowed disabled:border-sand-300 disabled:bg-canvas-200",
    "disabled:text-stone-500"
  );

/** 48px — comfortably above the 44px minimum touch target. */
export const CONTROL_HEIGHT = "h-12";
