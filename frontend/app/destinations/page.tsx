import { ArrowRight, ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { PageShell } from "@/components/layout/PageShell";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { SeasonGuide } from "@/components/sections/SeasonGuide";
import { ServiceHero } from "@/components/sections/ServiceHero";
import { ServiceStrip } from "@/components/sections/ServiceStrip";
import { Reveal } from "@/components/shared/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { DESTINATIONS, getDestination, type Destination } from "@/data/destinations";
import { PLAN_TRIP_HREF } from "@/lib/constants";
import { TRIP_PHOTOS } from "@/lib/images";
import { buildMetadata } from "@/lib/seo";
import { cn } from "@/utils/cn";

/**
 * /destinations
 *
 * A discovery page, not a search page: no filters, no result counts, no
 * availability. Hero → what each guide covers → editorial grid → starting
 * points by trip style → when to go → services → close.
 */
export const metadata: Metadata = buildMetadata({
  title: "Destinations",
  description:
    "Travel guides to Dubai, the Maldives, Bali, Singapore, Bangkok, London, Paris and New York — where to stay, getting around and when to go — with personal help planning flights, hotels and transfers.",
  path: "/destinations",
  image: TRIP_PHOTOS.beachPalms.src,
});

/**
 * Editorial grid rows. Column spans on a 12-column grid from `lg`, with a fixed
 * row height so tiles in the same row line up regardless of their width.
 */
const ROWS: readonly { slugs: readonly string[]; spans: readonly string[]; height: string }[] = [
  { slugs: ["dubai", "bali"], spans: ["lg:col-span-7", "lg:col-span-5"], height: "lg:h-[26rem]" },
  { slugs: ["maldives", "singapore", "bangkok"], spans: ["lg:col-span-4", "lg:col-span-4", "lg:col-span-4"], height: "lg:h-[19rem]" },
  { slugs: ["london", "paris", "new-york"], spans: ["lg:col-span-5", "lg:col-span-3", "lg:col-span-4"], height: "lg:h-[19rem]" },
];

const STARTING_POINTS: readonly { title: string; body: string; slugs: readonly string[] }[] = [
  {
    title: "Beaches and islands",
    body: "Slower days, resort stays and transfers worth arranging in advance.",
    slugs: ["maldives", "bali"],
  },
  {
    title: "City breaks",
    body: "Walkable neighbourhoods, museums, food and good public transport.",
    slugs: ["london", "paris", "new-york", "singapore"],
  },
  {
    title: "Stopovers on longer routes",
    body: "Places that work well for a few days between long-haul flights.",
    slugs: ["dubai", "singapore", "bangkok"],
  },
];

function DestinationEntry({
  destination,
  className,
  imageClassName,
  sizes,
}: {
  destination: Destination;
  className?: string;
  imageClassName?: string;
  sizes: string;
}) {
  return (
    <li className={className}>
      <Link href={`/destinations/${destination.slug}`} className="group block">
        <span className={cn("relative block aspect-[4/3] overflow-hidden rounded-[20px] bg-sand-300 lg:aspect-auto", imageClassName)}>
          <Image
            src={destination.image}
            alt={destination.imageAlt}
            fill
            sizes={sizes}
            className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04] motion-reduce:transform-none"
          />
        </span>
        <span className="mt-5 flex items-start justify-between gap-4">
          <span>
            <span className="block text-caption font-semibold uppercase tracking-[0.12em] text-stone-500">
              {destination.country}
            </span>
            <span className="mt-1 block text-[1.5rem] font-extrabold tracking-[-0.025em] text-ink-900 transition-colors duration-200 group-hover:text-clay-700">
              {destination.name}
            </span>
            <span className="mt-1.5 block max-w-md text-body-md text-foreground-muted">
              {destination.description}
            </span>
            <span className="mt-3 inline-flex items-center gap-1.5 text-body-sm font-bold text-ink-900">
              Explore {destination.name}
              <ArrowRight
                aria-hidden="true"
                className="size-4 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transform-none"
                strokeWidth={2.25}
              />
            </span>
          </span>
        </span>
      </Link>
    </li>
  );
}

export default function DestinationsPage() {
  return (
    <PageShell>
      <ServiceHero
        layout="overlay"
        eyebrow="Destinations"
        title="Places worth planning for."
        lede="Explore destinations and start building your travel request."
        image={TRIP_PHOTOS.beachPalms.src}
        imageAlt={TRIP_PHOTOS.beachPalms.alt}
        ctaLabel="Plan My Trip"
        ctaHref={PLAN_TRIP_HREF}
      />

      {/* --- What each guide covers --------------------------------------- */}
      <Section tone="canvas" space="md">
        <Reveal>
          <div className="grid gap-8 border-b border-line pb-12 lg:grid-cols-12 lg:gap-16">
            <p className="text-[1.25rem] font-semibold leading-relaxed tracking-[-0.01em] text-ink-900 sm:text-[1.5rem] lg:col-span-6">
              Each guide is a practical starting point — enough to decide
              where to stay and how to get around, before a specialist helps
              with the details.
            </p>
            <dl className="grid gap-6 sm:grid-cols-3 lg:col-span-6">
              {[
                { title: "Why go", body: "What the place is known for, and how long to give it." },
                { title: "Where to stay", body: "The main areas and what each one suits." },
                { title: "Getting around", body: "Arrival airports and local transport." },
              ].map((item) => (
                <div key={item.title} className="border-t-2 border-clay-500 pt-4">
                  <dt className="text-body-md font-bold text-ink-900">{item.title}</dt>
                  <dd className="mt-1.5 text-body-sm text-foreground-muted">{item.body}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>

        {/* --- Editorial grid --------------------------------------------- */}
        <div className="mt-12 space-y-12 lg:mt-16 lg:space-y-16">
          {ROWS.map((row) => (
            <Reveal key={row.slugs.join("-")}>
              <ul className="grid gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-12 lg:gap-x-6">
                {row.slugs.map((slug, index) => {
                  const destination = getDestination(slug);
                  if (!destination) return null;
                  return (
                    <DestinationEntry
                      key={slug}
                      destination={destination}
                      className={cn(
                        // An odd count on the two-column tablet grid: widen the last.
                        row.slugs.length === 3 && index === 2 && "sm:col-span-2",
                        row.spans[index]
                      )}
                      imageClassName={cn(row.height, row.slugs.length === 3 && index === 2 && "sm:aspect-[16/7] lg:aspect-auto")}
                      sizes="(min-width: 1024px) 50vw, (min-width: 640px) 50vw, 100vw"
                    />
                  );
                })}
              </ul>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* --- Starting points by trip style -------------------------------- */}
      <Section tone="ink" space="lg">
        <Reveal>
          <SectionHeading
            eyebrow="Starting points"
            title="Not sure where to go yet?"
            lede="Start with the kind of trip you want. These groupings are simply how the places tend to be used."
            size="lg"
            onDark
          />
        </Reveal>
        <Reveal className="mt-12">
          <ul className="grid gap-10 md:grid-cols-3 md:gap-8">
            {STARTING_POINTS.map((group) => (
              <li key={group.title} className="border-t border-white/15 pt-6">
                <h3 className="text-[1.25rem] font-bold tracking-[-0.015em] text-white">{group.title}</h3>
                <p className="mt-2 text-body-md text-white/70">{group.body}</p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {group.slugs.map((slug) => {
                    const destination = getDestination(slug);
                    if (!destination) return null;
                    return (
                      <li key={slug}>
                        <Link
                          href={`/destinations/${slug}`}
                          className="nx-focus-dark inline-flex min-h-10 items-center gap-1.5 rounded-full border border-white/25 px-4 text-[0.875rem] font-semibold text-white transition-colors duration-200 hover:border-amber-400 hover:text-amber-400"
                        >
                          {destination.name}
                          <ArrowUpRight aria-hidden="true" className="size-3.5" />
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </li>
            ))}
          </ul>
        </Reveal>
      </Section>

      <SeasonGuide tone="muted" />

      <ServiceStrip
        eyebrow="Once you know where"
        title="We'll help with the flights, the stay and the rides."
      />

      <FinalCTA
        title="We're not limited to this list."
        lede={`These ${DESTINATIONS.length} guides are starting points, not a catalogue. Tell us where you'd like to go and we'll help with the details.`}
        ctaLabel="Send Your Travel Request"
        ctaHref={PLAN_TRIP_HREF}
        image={TRIP_PHOTOS.balloons}
      />
    </PageShell>
  );
}
