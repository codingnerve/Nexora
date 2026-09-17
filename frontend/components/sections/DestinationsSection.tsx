import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { DestinationTile } from "@/components/destinations/DestinationTile";
import { Reveal } from "@/components/shared/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getDestination, type Destination } from "@/data/destinations";
import { cn } from "@/utils/cn";

/**
 * Destinations mosaic.
 *
 * Desktop: Dubai as one large feature, the Maldives and Bali as two medium tiles beside
 * it, then the remaining five as a row of smaller portrait tiles.
 * Phones: Dubai first at 4:3, then a compact two-column grid — the last tile
 * widens so the grid always ends on a full row.
 */

const FEATURE_SLUGS = ["dubai", "maldives", "bali"] as const;
const ROW_SLUGS = ["singapore", "bangkok", "london", "paris", "new-york"] as const;

function pick(slugs: readonly string[]): Destination[] {
  return slugs
    .map((slug) => getDestination(slug))
    .filter((destination): destination is Destination => Boolean(destination));
}

export function DestinationsSection({
  title = "Where are you thinking about going?",
  lede = "Start with a place in mind and we'll help with the flights, stays and transfers around it.",
  tone = "canvas",
}: {
  title?: string;
  lede?: string;
  tone?: "canvas" | "muted";
}) {
  const [feature, ...medium] = pick(FEATURE_SLUGS);
  const row = pick(ROW_SLUGS);

  return (
    <Section id="destinations" tone={tone} space="lg">
      <Reveal>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading eyebrow="Destinations" title={title} lede={lede} size="lg" />
          <Link
            href="/destinations"
            className="group/all inline-flex min-h-11 shrink-0 items-center gap-2 text-[1rem] font-bold text-ink-900 transition-colors duration-200 hover:text-clay-700"
          >
            All destinations
            <ArrowRight
              aria-hidden="true"
              className="size-[1.125rem] transition-transform duration-300 group-hover/all:translate-x-1 motion-reduce:transform-none"
              strokeWidth={2.25}
            />
          </Link>
        </div>
      </Reveal>

      <Reveal className="mt-10 lg:mt-14">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-12 lg:grid-rows-2 lg:gap-5">
          {feature ? (
            <DestinationTile
              destination={feature}
              size="lg"
              sizes="(min-width: 1280px) 800px, (min-width: 1024px) 58vw, 100vw"
              className="col-span-2 aspect-[4/3] sm:aspect-[16/10] lg:col-span-7 lg:row-span-2 lg:aspect-auto lg:min-h-[36rem]"
            />
          ) : null}
          {medium.map((destination) => (
            <DestinationTile
              key={destination.slug}
              destination={destination}
              size="md"
              sizes="(min-width: 1024px) 40vw, 50vw"
              className="aspect-[4/5] sm:aspect-[4/3] lg:col-span-5 lg:aspect-auto"
            />
          ))}
        </div>

        <div className="mt-3 grid grid-cols-2 gap-3 sm:mt-4 sm:gap-4 lg:mt-5 lg:grid-cols-5 lg:gap-5">
          {row.map((destination, index) => (
            <DestinationTile
              key={destination.slug}
              destination={destination}
              size="sm"
              sizes="(min-width: 1024px) 20vw, 50vw"
              className={cn(
                "aspect-[4/5] sm:aspect-[4/3] lg:aspect-[3/4]",
                // Five tiles: widen the last on phones (2 columns) so the grid ends flush.
                index === row.length - 1 && "col-span-2 aspect-[16/10] sm:aspect-[16/7] lg:col-span-1 lg:aspect-[3/4]"
              )}
            />
          ))}
        </div>
      </Reveal>
    </Section>
  );
}
