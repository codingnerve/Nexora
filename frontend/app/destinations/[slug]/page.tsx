import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Car, Hotel, Plane, PlaneLanding } from "lucide-react";

import { DestinationTile } from "@/components/destinations/DestinationTile";
import { PageShell } from "@/components/layout/PageShell";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { NumberedList } from "@/components/sections/NumberedList";
import { SplitFeature } from "@/components/sections/SplitFeature";
import { JsonLd } from "@/components/shared/JsonLd";
import { Reveal } from "@/components/shared/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Eyebrow, SectionHeading } from "@/components/ui/SectionHeading";
import { DESTINATIONS, getDestination } from "@/data/destinations";
import { PLAN_TRIP_HREF } from "@/lib/constants";
import { CAB_PHOTOS, HOTEL_PHOTOS } from "@/lib/images";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/structuredData";

/**
 * /destinations/[slug]
 *
 * One template, eight destinations, all content from `data/destinations.ts`.
 * Fully static: `generateStaticParams` prerenders every slug at build time.
 *
 * Hero → why go → what travellers plan → planning notes → where to stay →
 * getting around → when planning matters → more destinations → close.
 */

/** Prerenders every destination at build time. */
export function generateStaticParams() {
  return DESTINATIONS.map((destination) => ({ slug: destination.slug }));
}

/** Unknown slugs 404 rather than rendering an empty page. */
export const dynamicParams = false;

export async function generateMetadata(
  props: PageProps<"/destinations/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const destination = getDestination(slug);

  if (!destination) {
    return buildMetadata({
      title: "Destination not found",
      description: "This destination page could not be found.",
      path: `/destinations/${slug}`,
      noIndex: true,
    });
  }

  return buildMetadata({
    title: `${destination.name} Travel Guide & Trip Planning`,
    description: `Planning a trip to ${destination.name}, ${destination.country}? Where to stay, getting around and when to go — plus personal help with flights, hotels and airport transfers from Nexora Destinations.`,
    path: `/destinations/${destination.slug}`,
    image: destination.image,
  });
}

/**
 * General planning considerations. Deliberately destination-agnostic: entry
 * rules, fares and availability change, so nothing here asserts a specific
 * requirement or price.
 */
const CONSIDERATIONS = [
  {
    title: "Check entry requirements early",
    body: "Visa and entry rules depend on your nationality and change over time. Please confirm with the official guidance for your route.",
  },
  {
    title: "Travel dates make a difference",
    body: "School holidays, festivals and peak seasons affect what's available. If your dates are flexible, tell us — it gives us more to work with.",
  },
  {
    title: "Plan the arrival, not just the flight",
    body: "Late-night and early-morning arrivals are much easier with a transfer arranged in advance.",
  },
  {
    title: "Match the stay to the plan",
    body: "Choose the area around what you'll actually do each day, not only the hotel itself.",
  },
] as const;

export default async function DestinationPage(props: PageProps<"/destinations/[slug]">) {
  const { slug } = await props.params;
  const destination = getDestination(slug);

  if (!destination) notFound();

  const { name } = destination;
  // The next three destinations in order, wrapping round, so every page links
  // onward to a different set.
  const index = DESTINATIONS.findIndex((d) => d.slug === destination.slug);
  const others = [1, 2, 3].map((step) => DESTINATIONS[(index + step) % DESTINATIONS.length]!);
  const stayPhoto = destination.stayStyle === "resort" ? HOTEL_PHOTOS.infinityDeck : HOTEL_PHOTOS.cityRoom;

  const plans = [
    {
      icon: Plane,
      title: "Flights",
      body: `Routes into ${name}, with dates, cabin and airline preferences.`,
      href: "/flights",
      label: "Flight assistance",
    },
    {
      icon: Hotel,
      title: "Hotels",
      body: `A stay in the part of ${name} that suits your plans.`,
      href: "/hotels",
      label: "Hotel assistance",
    },
    {
      icon: PlaneLanding,
      title: "Airport transfers",
      body: "A pickup planned around your arrival time and luggage.",
      href: "/cabs",
      label: "Transfer assistance",
    },
    {
      icon: Car,
      title: "Local transportation",
      body: `Rides between your hotel, venues and day trips around ${name}.`,
      href: "/cabs",
      label: "Cab assistance",
    },
  ] as const;

  return (
    <PageShell>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Destinations", path: "/destinations" },
          { name, path: `/destinations/${destination.slug}` },
        ])}
      />

      {/* --- Hero ---------------------------------------------------------- */}
      <section aria-labelledby="destination-heading" className="pt-4 sm:pt-6">
        <Container>
          <nav aria-label="Breadcrumb" className="mb-4 text-[0.875rem] text-stone-600">
            <ol className="flex items-center gap-2">
              <li>
                <Link href="/destinations" className="font-medium hover:text-ink-900">
                  Destinations
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="font-semibold text-ink-900">
                {name}
              </li>
            </ol>
          </nav>

          <div className="relative isolate overflow-hidden rounded-[24px] bg-ink-900">
            <Image
              src={destination.image}
              alt={destination.imageAlt}
              fill
              preload
              quality={85}
              sizes="(min-width: 1536px) 1500px, 100vw"
              className="-z-10 object-cover object-center"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 -z-10 bg-gradient-to-t from-ink-950/90 via-ink-950/40 to-ink-950/5"
            />

            <div className="flex min-h-[clamp(28rem,68vh,40rem)] flex-col justify-end px-6 pb-10 pt-24 sm:px-10 sm:pb-12 lg:px-16 lg:pb-16">
              <div className="max-w-2xl">
                <Eyebrow onDark>{destination.country}</Eyebrow>
                <h1
                  id="destination-heading"
                  className="mt-3 font-display text-display-xl text-white lg:text-display-2xl"
                >
                  {name}
                </h1>
                <p className="mt-5 max-w-xl text-body-lg text-white/85">{destination.tagline}</p>
                <div className="mt-8">
                  <ButtonLink
                    href={PLAN_TRIP_HREF}
                    variant="accent"
                    size="lg"
                    onDark
                    iconRight={<ArrowRight />}
                    fullWidthOnMobile
                  >
                    Plan My {name} Trip
                  </ButtonLink>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* --- Why go -------------------------------------------------------- */}
      <Section space="lg">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-5">
            <Eyebrow>Why {name}</Eyebrow>
            <h2 className="mt-4 font-display text-display-md text-ink-900 md:text-display-lg">
              {destination.description}
            </h2>
          </Reveal>
          <Reveal className="lg:col-span-7" delay={0.06}>
            <p className="text-[1.1875rem] leading-relaxed text-foreground sm:text-[1.3125rem]">
              {destination.overview}
            </p>
            <dl className="mt-10 grid gap-x-10 sm:grid-cols-2">
              {destination.highlights.map((highlight) => (
                <div key={highlight.title} className="border-t border-line py-5">
                  <dt className="text-body-lg font-bold tracking-[-0.01em] text-ink-900">{highlight.title}</dt>
                  <dd className="mt-1.5 text-body-md text-foreground-muted">{highlight.body}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </Section>

      {/* --- What travellers often plan ----------------------------------- */}
      <Section tone="muted" space="lg">
        <Reveal>
          <SectionHeading
            eyebrow="What travellers often plan"
            title={`Getting to ${name}, staying and getting around.`}
            lede="Ask about one of these or all of them together in a single request."
            size="lg"
          />
        </Reveal>
        <Reveal className="mt-10 lg:mt-12">
          <ul className="grid gap-x-8 sm:grid-cols-2 lg:grid-cols-4">
            {plans.map(({ icon: Icon, title, body, href, label }) => (
              <li key={title} className="border-t border-sand-400/70">
                <Link href={href} className="group flex h-full flex-col py-6" aria-label={`${title}: ${label}`}>
                  <Icon aria-hidden="true" className="size-6 text-clay-600" strokeWidth={1.75} />
                  <span className="mt-4 text-[1.1875rem] font-bold tracking-[-0.015em] text-ink-900">{title}</span>
                  <span className="mt-1.5 flex-1 text-body-md text-foreground-muted">{body}</span>
                  <span className="mt-4 inline-flex items-center gap-2 text-body-sm font-bold text-ink-900 transition-colors duration-200 group-hover:text-clay-700">
                    {label}
                    <ArrowRight
                      aria-hidden="true"
                      className="size-4 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transform-none"
                      strokeWidth={2.25}
                    />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>
      </Section>

      {/* --- Planning your trip ------------------------------------------- */}
      <Section tone="canvas" space="lg">
        <Reveal>
          <SectionHeading eyebrow="Planning your trip" title="The practical bits." size="lg" />
        </Reveal>
        <Reveal className="mt-10">
          <dl className="grid gap-8 md:grid-cols-3 md:gap-10">
            {destination.planning.map((note) => (
              <div key={note.label} className="border-t-2 border-clay-500 pt-5">
                <dt className="text-caption font-bold uppercase tracking-[0.12em] text-stone-600">{note.label}</dt>
                <dd className="mt-3 text-[1.1875rem] font-semibold leading-snug tracking-[-0.01em] text-ink-900">
                  {note.value}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </Section>

      {/* --- Where to stay ------------------------------------------------- */}
      <SplitFeature image={stayPhoto} imageSide="right" ratio="tall" tone="muted">
        <SectionHeading eyebrow="Where to stay" title={`Choosing an area in ${name}.`} size="lg" />
        <dl className="mt-8">
          {destination.areas.map((area) => (
            <div key={area.name} className="border-t border-sand-400/70 py-5">
              <dt className="text-body-lg font-bold tracking-[-0.01em] text-ink-900">{area.name}</dt>
              <dd className="mt-1.5 text-body-md text-foreground-muted">{area.body}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-4 text-caption text-stone-500">
          A general overview of areas, not a list of available hotels.
        </p>
        <ButtonLink href="/hotels#plan-your-trip" variant="primary" size="lg" iconRight={<ArrowRight />} className="mt-8" fullWidthOnMobile>
          Request Hotel Options
        </ButtonLink>
      </SplitFeature>

      {/* --- Getting around ------------------------------------------------ */}
      <SplitFeature image={destination.gallery} imageSide="left" ratio="landscape" tone="ink">
        <SectionHeading eyebrow="Getting around" title={`Arriving in ${name}.`} size="lg" onDark />
        <p className="mt-6 text-body-lg text-white/80">{destination.arrival}</p>
        <p className="mt-4 text-body-md text-white/65">
          {destination.planning.find((note) => note.label === "Getting around")?.value}
        </p>
        <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
          <ButtonLink href="/cabs#plan-your-trip" variant="accent" size="lg" onDark iconRight={<ArrowRight />} fullWidthOnMobile>
            Request an Airport Transfer
          </ButtonLink>
          <Link
            href="/flights"
            className="nx-focus-dark group inline-flex min-h-11 items-center gap-2 text-[1rem] font-bold text-white transition-colors duration-200 hover:text-amber-400"
          >
            Flights to {name}
            <ArrowRight aria-hidden="true" className="size-[1.125rem] transition-transform duration-300 group-hover:translate-x-1" strokeWidth={2.25} />
          </Link>
        </div>
      </SplitFeature>

      {/* --- When planning matters ---------------------------------------- */}
      <Section tone="canvas" space="lg">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-4">
            <SectionHeading
              eyebrow="When planning matters"
              title="Worth sorting out before you go."
              size="md"
            />
            <div className="relative mt-8 hidden aspect-[4/5] overflow-hidden rounded-[20px] bg-sand-300 lg:block">
              <Image src={CAB_PHOTOS.luggage.src} alt={CAB_PHOTOS.luggage.alt} fill sizes="30vw" className="object-cover" />
            </div>
          </Reveal>
          <Reveal className="lg:col-span-8" delay={0.06}>
            <NumberedList items={CONSIDERATIONS} columns={2} />
          </Reveal>
        </div>
      </Section>

      {/* --- More destinations -------------------------------------------- */}
      <Section tone="muted" space="lg">
        <Reveal>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading eyebrow="Keep exploring" title="Other places worth planning for." size="md" />
            <Link
              href="/destinations"
              className="group inline-flex min-h-11 shrink-0 items-center gap-2 text-[1rem] font-bold text-ink-900 transition-colors duration-200 hover:text-clay-700"
            >
              All destinations
              <ArrowRight aria-hidden="true" className="size-[1.125rem] transition-transform duration-300 group-hover:translate-x-1" strokeWidth={2.25} />
            </Link>
          </div>
        </Reveal>
        <Reveal className="mt-10">
          <div className="grid gap-4 sm:grid-cols-3 lg:gap-5">
            {others.map((other) => (
              <DestinationTile
                key={other.slug}
                destination={other}
                size="md"
                sizes="(min-width: 640px) 33vw, 100vw"
                className="aspect-[4/3] sm:aspect-[4/5] lg:aspect-[4/3]"
              />
            ))}
          </div>
        </Reveal>
      </Section>

      <FinalCTA
        title={`Start your ${name} trip.`}
        lede="Tell us your dates and what you need. A specialist will come back to you with options."
        ctaLabel="Plan My Trip"
        ctaHref={PLAN_TRIP_HREF}
      />
    </PageShell>
  );
}
