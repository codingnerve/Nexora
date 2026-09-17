import type { ReactNode } from "react";

import { cn } from "@/utils/cn";

/**
 * TravelOptionCard — a structured summary of what a customer has told us, or
 * of an option a specialist has put together for them.
 *
 * This is the one genuinely *enclosed* card in the system: white surface,
 * visible border, a 4px radius and a terracotta spine down the left edge. That
 * containment is deliberate — it signals "this is a record" as opposed to the
 * open editorial plates used for destinations and services.
 *
 * Values render with tabular figures so dates, counts and reference codes stay
 * aligned. `price` is optional and unset by default: no price is ever shown
 * unless a real one has been supplied by the travel team.
 */

export interface TravelOptionRow {
  readonly label: string;
  readonly value: ReactNode;
}

export function TravelOptionCard({
  reference,
  title,
  subtitle,
  rows,
  note,
  footer,
  className,
}: {
  /** e.g. an inquiry reference — shown as the card's eyebrow. */
  reference?: string;
  title: string;
  subtitle?: string;
  rows: readonly TravelOptionRow[];
  note?: ReactNode;
  footer?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[12px] border border-sand-300",
        "bg-white shadow-subtle",
        className
      )}
    >
      {/* The terracotta spine — the card's identifying mark. */}
      <span
        aria-hidden="true"
        className="absolute inset-y-0 left-0 w-[3px] bg-clay-600"
      />

      <div className="p-5 pl-6 sm:p-6 sm:pl-7">
        <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-2">
          <div>
            {reference ? (
              <p className="nx-figures text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-stone-600">
                {reference}
              </p>
            ) : null}

            <h3 className="mt-1.5 font-display text-display-sm text-ink-900">
              {title}
            </h3>

            {subtitle ? (
              <p className="mt-1 text-body-sm text-foreground-muted">{subtitle}</p>
            ) : null}
          </div>
        </div>

        <dl className="mt-6 divide-y divide-sand-300/70 border-t border-sand-300/70">
          {rows.map((row) => (
            <div
              key={row.label}
              className="flex items-baseline justify-between gap-6 py-2.5"
            >
              <dt className="shrink-0 text-body-sm text-stone-600">{row.label}</dt>
              <dd className="nx-figures text-right text-body-sm font-semibold text-ink-900">
                {row.value}
              </dd>
            </div>
          ))}
        </dl>

        {note ? (
          <p className="mt-5 border-t border-sand-300/70 pt-4 text-caption text-stone-500">
            {note}
          </p>
        ) : null}

        {footer ? <div className="mt-5">{footer}</div> : null}
      </div>
    </div>
  );
}
