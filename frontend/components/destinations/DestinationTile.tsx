import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import type { Destination } from "@/data/destinations";
import { cn } from "@/utils/cn";

/**
 * A photographic destination tile: the name, a short descriptor and an arrow
 * over the image — no prices, ratings or availability.
 *
 * The arrow is always visible, so touch users get the same affordance as mouse
 * users; on hover the photo eases in and the arrow fills. The caller sets the
 * tile's size and aspect ratio via `className`.
 */
export function DestinationTile({
  destination,
  size,
  sizes,
  className,
}: {
  destination: Destination;
  size: "lg" | "md" | "sm";
  sizes: string;
  className?: string;
}) {
  return (
    <Link
      href={`/destinations/${destination.slug}`}
      className={cn(
        "group relative isolate block overflow-hidden rounded-[20px] bg-ink-900",
        className
      )}
    >
      <Image
        src={destination.image}
        alt={destination.imageAlt}
        fill
        sizes={sizes}
        className={cn(
          "-z-10 object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
          "group-hover:scale-[1.05] motion-reduce:transform-none motion-reduce:transition-none"
        )}
      />

      {/* Image overlay: the one place gradients are used. */}
      <span
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-t from-ink-950/85 via-ink-950/25 to-transparent"
      />

      <span
        className={cn(
          "absolute inset-x-0 bottom-0 flex items-end justify-between gap-4",
          size === "lg" ? "p-6 sm:p-8" : "p-4 sm:p-5"
        )}
      >
        <span className="block min-w-0">
          <span
            className={cn(
              "block font-extrabold leading-tight tracking-[-0.025em] text-white",
              size === "lg"
                ? "text-[1.875rem] sm:text-[2.5rem]"
                : size === "md"
                  ? "text-[1.5rem] sm:text-[1.75rem]"
                  : "text-[1.1875rem] sm:text-[1.375rem]"
            )}
          >
            {destination.name}
          </span>
          <span
            className={cn(
              "mt-1 block font-medium text-white/80",
              size === "lg" ? "max-w-sm text-body-md" : "text-[0.8125rem] leading-snug sm:text-[0.875rem]",
              size === "sm" && "line-clamp-2"
            )}
          >
            {destination.tagline}
          </span>
        </span>

        <span
          aria-hidden="true"
          className={cn(
            "flex shrink-0 items-center justify-center rounded-full border border-white/40 text-white",
            "transition-[background-color,color,border-color] duration-300",
            "group-hover:border-white group-hover:bg-white group-hover:text-ink-900",
            size === "sm" ? "size-8" : "size-10"
          )}
        >
          <ArrowUpRight className={size === "sm" ? "size-4" : "size-5"} strokeWidth={2} />
        </span>
      </span>
    </Link>
  );
}
