import type { ReactNode } from "react";

import { cn } from "@/utils/cn";

/**
 * ContactCard — a single way to reach the team.
 *
 * A quiet white surface (16px radius, thin border, no resting shadow),
 * which distinguishes it at a glance from the crisp white `TravelOptionCard`
 * and the borderless editorial plates.
 *
 * `value` is only ever passed from configuration. The component renders
 * nothing at all when there is no value, so an unconfigured channel silently
 * disappears instead of showing an empty row or an invented detail.
 */
export function ContactCard({
  icon,
  label,
  value,
  href,
  hint,
  onDark = false,
  className,
}: {
  icon: ReactNode;
  label: string;
  /** When empty or undefined the card does not render. */
  value?: string;
  href?: string;
  hint?: string;
  onDark?: boolean;
  className?: string;
}) {
  if (!value) return null;

  const inner = (
    <>
      <span
        aria-hidden="true"
        className={cn(
          "flex size-10 shrink-0 items-center justify-center rounded-[12px] border [&>svg]:size-[1.125rem]",
          onDark
            ? "border-clay-400/30 bg-clay-500/15 text-clay-400"
            : "border-clay-600/25 bg-clay-600/[0.07] text-clay-700"
        )}
      >
        {icon}
      </span>

      <span className="flex min-w-0 flex-col">
        <span
          className={cn(
            "text-[0.6875rem] font-semibold uppercase tracking-[0.14em]",
            onDark ? "text-sand-400" : "text-stone-600"
          )}
        >
          {label}
        </span>

        <span
          className={cn(
            "mt-1 break-words text-body-md font-semibold",
            onDark ? "text-canvas-100" : "text-ink-900",
            href && "transition-colors duration-[180ms]",
            href && (onDark ? "group-hover:text-clay-400" : "group-hover:text-clay-700")
          )}
        >
          {value}
        </span>

        {hint ? (
          <span
            className={cn(
              "mt-1 text-caption",
              onDark ? "text-stone-400" : "text-stone-500"
            )}
          >
            {hint}
          </span>
        ) : null}
      </span>
    </>
  );

  const surface = cn(
    "group flex items-start gap-4 rounded-[16px] border p-5",
    "transition-colors duration-[180ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
    onDark
      ? "border-line-inverse bg-canvas-100/[0.04] hover:bg-canvas-100/[0.07] nx-focus-dark"
      : "border-sand-300 bg-white hover:border-sand-400 hover:shadow-subtle",
    className
  );

  if (!href) {
    return <div className={surface}>{inner}</div>;
  }

  return (
    <a href={href} className={surface}>
      {inner}
    </a>
  );
}
