import type { ReactNode } from "react";

import { cn } from "@/utils/cn";

/**
 * A flat, numbered list of short notes — planning tips, preferences, things to
 * consider. Hairline rules and numerals instead of cards.
 */
export function NumberedList({
  items,
  columns = 2,
  onDark = false,
  numbered = true,
  className,
}: {
  items: readonly { title: string; body: ReactNode }[];
  columns?: 1 | 2 | 3;
  onDark?: boolean;
  numbered?: boolean;
  className?: string;
}) {
  return (
    <dl
      className={cn(
        "grid gap-x-10 lg:gap-x-12",
        columns === 3 && "sm:grid-cols-2 lg:grid-cols-3",
        columns === 2 && "sm:grid-cols-2",
        className
      )}
    >
      {items.map((item, index) => (
        <div
          key={item.title}
          className={cn("flex gap-5 border-t py-6", onDark ? "border-white/15" : "border-line")}
        >
          {numbered ? (
            <span
              aria-hidden="true"
              className={cn(
                "nx-figures w-7 shrink-0 pt-0.5 text-body-md font-extrabold",
                onDark ? "text-amber-400" : "text-clay-600"
              )}
            >
              {String(index + 1).padStart(2, "0")}
            </span>
          ) : null}
          <div>
            <dt
              className={cn(
                "text-body-lg font-bold tracking-[-0.01em]",
                onDark ? "text-white" : "text-ink-900"
              )}
            >
              {item.title}
            </dt>
            <dd className={cn("mt-1.5 text-body-md", onDark ? "text-white/70" : "text-foreground-muted")}>
              {item.body}
            </dd>
          </div>
        </div>
      ))}
    </dl>
  );
}
