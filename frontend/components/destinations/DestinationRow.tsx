import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { EditorialImage, type ImageRatio } from "@/components/ui/EditorialImage";
import { cn } from "@/utils/cn";

/**
 * A full-width alternating destination row for the /destinations index.
 *
 * Distinct from `DestinationCard`, which is a compact plate for grids. This is
 * the wide editorial treatment: image on one side, a column of type on the
 * other, sides swapping down the page so the index never settles into a
 * repeating rhythm.
 */
export function DestinationRow({
  name,
  country,
  description,
  image,
  imageAlt,
  href,
  /** Places the image on the right instead of the left. */
  reverse = false,
  ratio = "landscape",
  index,
}: {
  name: string;
  country: string;
  description: string;
  image: string;
  imageAlt: string;
  href: string;
  reverse?: boolean;
  ratio?: ImageRatio;
  index: number;
}) {
  return (
    <article className="group">
      <Link
        href={href}
        className={cn(
          "grid items-center gap-7 rounded-[8px] lg:grid-cols-12 lg:gap-14"
        )}
      >
        <div
          className={cn(
            "lg:col-span-7",
            reverse && "lg:order-2 lg:col-start-6"
          )}
        >
          <EditorialImage
            src={image}
            alt={imageAlt}
            ratio={ratio}
            corner="plate"
            zoomOnHover
            sizes="(min-width: 1024px) 58vw, 100vw"
          />
        </div>

        <div className={cn("lg:col-span-5", reverse && "lg:order-1 lg:row-start-1")}>
          <p className="flex items-baseline gap-4">
            <span
              aria-hidden="true"
              className="nx-figures text-body-sm font-semibold text-clay-600"
            >
              {String(index).padStart(2, "0")}
            </span>
            <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-stone-600">
              {country}
            </span>
          </p>

          <h3 className="mt-4 font-display text-display-md text-ink-900 transition-colors duration-[180ms] group-hover:text-clay-700">
            {name}
          </h3>

          <p className="mt-4 max-w-md text-body-md text-foreground-muted">
            {description}
          </p>

          <span className="mt-6 inline-flex items-center gap-2 text-body-sm font-semibold text-ink-900 transition-colors duration-[180ms] group-hover:text-clay-700">
            Plan a Trip
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
