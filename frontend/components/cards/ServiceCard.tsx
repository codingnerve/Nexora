import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { EditorialImage, type ImageRatio } from "@/components/ui/EditorialImage";
import { cn } from "@/utils/cn";

/**
 * ServiceCard — flights, hotels, cabs.
 *
 * Distinct from `DestinationCard` by construction: this one carries a numbered
 * index and a terracotta rule across the top of the caption, and it is designed
 * to be used at *different crops per instance* so the three services never
 * line up as three identical tiles. The `ratio` and `align` props exist
 * specifically to break that symmetry.
 *
 * Photography carries the meaning here — there is no decorative service icon.
 */
export function ServiceCard({
  index,
  title,
  description,
  ctaLabel,
  href,
  image,
  imageAlt,
  ratio = "landscape",
  /** Offsets the card vertically so a row of services sits asymmetrically. */
  offset = false,
  className,
}: {
  /** Displayed as "01", "02", "03". */
  index: number;
  title: string;
  description: string;
  ctaLabel: string;
  href: string;
  image: string;
  imageAlt: string;
  ratio?: ImageRatio;
  offset?: boolean;
  className?: string;
}) {
  return (
    <article
      className={cn("group", offset && "lg:mt-16", className)}
    >
      <Link href={href} className="block rounded-[8px]">
        <EditorialImage
          src={image}
          alt={imageAlt}
          ratio={ratio}
          corner="plate"
          zoomOnHover
          sizes="(min-width: 1024px) 32vw, (min-width: 640px) 50vw, 100vw"
        />

        <div className="mt-6 border-t border-line pt-5">
          <div className="flex items-baseline gap-4">
            <span
              aria-hidden="true"
              className="nx-figures text-body-sm font-semibold text-clay-600"
            >
              {String(index).padStart(2, "0")}
            </span>

            <h3 className="font-display text-display-sm text-ink-900 transition-colors duration-[180ms] group-hover:text-clay-700">
              {title}
            </h3>
          </div>

          <p className="mt-3 max-w-sm text-body-md text-foreground-muted">
            {description}
          </p>

          <span
            className={cn(
              "mt-5 inline-flex items-center gap-2 text-body-sm font-semibold text-ink-900",
              "transition-colors duration-[180ms] group-hover:text-clay-700"
            )}
          >
            {ctaLabel}
            <ArrowRight
              aria-hidden="true"
              className={cn(
                "size-4 transition-transform duration-[240ms]",
                "ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1",
                "motion-reduce:transform-none"
              )}
              strokeWidth={2}
            />
          </span>
        </div>
      </Link>
    </article>
  );
}
