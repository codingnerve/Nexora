import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { EditorialImage, type ImageRatio } from "@/components/ui/EditorialImage";
import { cn } from "@/utils/cn";

/**
 * DestinationCard.
 *
 * Intentionally *not* a card in the usual sense: no border, no shadow, no
 * enclosing panel. The photograph sits directly on the ivory page with the
 * caption set beneath it, the way a destination plate appears in a travel
 * magazine. Structure comes from the image edge and the hairline, not a box.
 *
 * Nothing here displays a price, rating, review count or availability — the
 * business has no such data, and inventing it would misrepresent the service.
 */
export function DestinationCard({
  name,
  country,
  description,
  image,
  imageAlt,
  href,
  ratio = "portrait",
  priority = false,
  className,
}: {
  name: string;
  country: string;
  description: string;
  image: string;
  imageAlt: string;
  href: string;
  /** Varied per position so a grid never reads as identical tiles. */
  ratio?: ImageRatio;
  priority?: boolean;
  className?: string;
}) {
  return (
    <article className={cn("group", className)}>
      <Link href={href} className="block rounded-[8px]">
        <EditorialImage
          src={image}
          alt={imageAlt}
          ratio={ratio}
          corner="plate"
          zoomOnHover
          priority={priority}
          sizes="(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 100vw"
        />

        <div className="mt-5">
          <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-stone-600">
            {country}
          </p>

          <h3
            className={cn(
              "mt-2 font-display text-display-sm text-ink-900",
              "transition-colors duration-[180ms] group-hover:text-clay-700"
            )}
          >
            {name}
          </h3>

          <p className="mt-2.5 max-w-sm text-body-sm text-foreground-muted">
            {description}
          </p>

          <span
            className={cn(
              "mt-4 inline-flex items-center gap-2 text-body-sm font-semibold",
              "text-ink-900 transition-colors duration-[180ms]",
              "group-hover:text-clay-700"
            )}
          >
            Plan a trip
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
