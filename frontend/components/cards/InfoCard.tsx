import type { ReactNode } from "react";

import { cn } from "@/utils/cn";

/**
 * InfoCard — value propositions and "how it works" steps.
 *
 * The quietest surface in the system: **no image, no border box, no shadow,
 * no radius.** Just a hairline across the top, an index or small line icon,
 * and text. Sitting next to the photographic cards, its flatness is what makes
 * a page feel art-directed rather than uniformly tiled.
 *
 * Headings here are Manrope, not the display serif — that difference keeps
 * these from competing with `DestinationCard` and `ServiceCard` titles.
 */
export function InfoCard({
  index,
  icon,
  title,
  description,
  onDark = false,
  className,
}: {
  /** Shown as "01". Mutually exclusive with `icon` in practice. */
  index?: number;
  icon?: ReactNode;
  title: string;
  description: string;
  onDark?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "border-t pt-6",
        onDark ? "border-line-inverse" : "border-line",
        className
      )}
    >
      {index !== undefined ? (
        <span
          aria-hidden="true"
          className={cn(
            "nx-figures block font-display text-display-sm",
            onDark ? "text-clay-400" : "text-clay-600"
          )}
        >
          {String(index).padStart(2, "0")}
        </span>
      ) : null}

      {icon ? (
        <span
          aria-hidden="true"
          className={cn(
            "block [&>svg]:size-6",
            onDark ? "text-clay-400" : "text-clay-600"
          )}
        >
          {icon}
        </span>
      ) : null}

      <h3
        className={cn(
          "mt-4 text-body-lg font-semibold tracking-[-0.01em]",
          onDark ? "text-canvas-100" : "text-ink-900"
        )}
      >
        {title}
      </h3>

      <p
        className={cn(
          "mt-2.5 text-body-sm",
          onDark ? "text-sand-300" : "text-foreground-muted"
        )}
      >
        {description}
      </p>
    </div>
  );
}
