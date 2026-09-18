import { ArrowRight, Globe2, MapPin, Repeat, MoveRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { FlightForm } from "@/components/forms/FlightForm";
import { InquiryCard } from "@/components/forms/InquiryCard";
import { PageShell } from "@/components/layout/PageShell";
import { FaqAccordion } from "@/components/sections/FaqAccordion";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { FullBleedBand } from "@/components/sections/FullBleedBand";
import { NumberedList } from "@/components/sections/NumberedList";
import { PopularPlaces } from "@/components/sections/PopularPlaces";
import { ServiceHero } from "@/components/sections/ServiceHero";
import { SplitFeature } from "@/components/sections/SplitFeature";
import { Reveal } from "@/components/shared/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FLIGHT_AREAS, FLIGHT_FAQS, FLIGHT_JOURNEY, FLIGHT_TIPS } from "@/data/servicePages";
import { FLIGHT_PHOTOS } from "@/lib/images";
import { buildMetadata } from "@/lib/seo";

/**
 * /flights
 *
 * Hero → request form → what we help with → the journey (full-bleed) → planning
 * tips → why personal assistance (split) → FAQ → dark close.
 *
 * The form is the existing flight inquiry, unchanged. Nothing on the page shows
 * fares, schedules or availability.
 */
export const metadata: Metadata = buildMetadata({
  title: "Flight Booking Assistance",
  description:
    "Share your route, dates and cabin preference, and Nexora Destinations' travel specialists will help you work through domestic and international flight options. No online payment.",
  path: "/flights",
  image: FLIGHT_PHOTOS.takeoff.src,
});

const AREA_ICONS = [MapPin, Globe2, Repeat, MoveRight] as const;

const ROUTE_IDEAS = [
  { label: "Dubai", href: "/destinations/dubai" },
  { label: "Singapore", href: "/destinations/singapore" },
  { label: "London", href: "/destinations/london" },
  { label: "New York", href: "/destinations/new-york" },
] as const;

export default function FlightsPage() {
  return (
    <PageShell>
      <ServiceHero
        layout="overlay"
        eyebrow="Flights"
        title="Flight planning, without the guesswork."
        lede="Share your route, dates and preferences and our travel specialists will help you work through the available options."
        image={FLIGHT_PHOTOS.takeoff.src}
        imageAlt={FLIGHT_PHOTOS.takeoff.alt}
        ctaLabel="Request Flight Options"
      />

      {/* --- Request form -------------------------------------------------- */}
      <Section tone="canvas" space="md">
        <Reveal>
          <InquiryCard
            title="Tell us about your flight."
            lede="Two short steps: your trip, then how to reach you. A specialist will come back to you with options — nothing is booked or charged."
          >
            <FlightForm extended />
          </InquiryCard>
        </Reveal>
      </Section>

      <PopularPlaces service="flights" tone="canvas" className="border-t border-line" />

      {/* --- What we help with -------------------------------------------- */}
      <SplitFeature image={FLIGHT_PHOTOS.cabin} inset={FLIGHT_PHOTOS.landing} tone="muted" ratio="tall">
        <SectionHeading
          eyebrow="What we help with"
          title="What can we help with?"
          lede="Whether it's a short domestic hop or a long-haul journey with a connection, describe it and we'll look into it."
          size="lg"
        />
        <dl className="mt-10 grid gap-x-8 sm:grid-cols-2">
          {FLIGHT_AREAS.map((area, index) => {
            const Icon = AREA_ICONS[index] ?? MapPin;
            return (
              <div key={area.title} className="border-t border-sand-400/70 py-6">
                <dt className="flex items-center gap-3 text-body-lg font-bold tracking-[-0.01em] text-ink-900">
                  <Icon aria-hidden="true" className="size-5 shrink-0 text-clay-600" strokeWidth={1.75} />
                  {area.title}
                </dt>
                <dd className="mt-2 text-body-md text-foreground-muted">{area.body}</dd>
              </div>
            );
          })}
        </dl>
      </SplitFeature>

      {/* --- The journey --------------------------------------------------- */}
      <FullBleedBand
        image={FLIGHT_PHOTOS.arrival}
        eyebrow="The journey"
        title="From departure to arrival."
        lede="A good flight option depends on more than the destination. These are the details a specialist plans around."
        align="right"
        objectPosition="object-[30%_center]"
      >
        <NumberedList items={FLIGHT_JOURNEY} columns={1} onDark className="mt-8" />
      </FullBleedBand>

      {/* --- Planning tips ------------------------------------------------- */}
      <Section tone="canvas" space="lg">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <SectionHeading
                eyebrow="Planning tips"
                title="A few things that make the request stronger."
                lede="None of this is required, but each one gives a specialist more to work with."
                size="md"
              />
              <p className="mt-8 text-body-md text-foreground-muted">
                Looking for ideas? Read our guides to{" "}
                {ROUTE_IDEAS.map((idea, index) => (
                  <span key={idea.href}>
                    <Link
                      href={idea.href}
                      className="font-semibold text-ink-900 underline decoration-clay-500 underline-offset-4 hover:text-clay-700"
                    >
                      {idea.label}
                    </Link>
                    {index < ROUTE_IDEAS.length - 2 ? ", " : index === ROUTE_IDEAS.length - 2 ? " and " : "."}
                  </span>
                ))}
              </p>
            </div>
          </Reveal>
          <Reveal className="lg:col-span-8" delay={0.06}>
            <NumberedList items={FLIGHT_TIPS} columns={2} />
          </Reveal>
        </div>
      </Section>

      {/* --- Why personal assistance --------------------------------------- */}
      <SplitFeature image={FLIGHT_PHOTOS.gateSunrise} imageSide="right" ratio="landscape" tone="muted">
        <SectionHeading
          eyebrow="Personal assistance"
          title="Why ask a person instead of searching alone?"
          size="lg"
        />
        <div className="mt-6 space-y-4 text-body-lg text-foreground-muted">
          <p>
            Search engines are good at listing flights. They are less good at
            knowing that you&rsquo;d rather leave later, that the connection
            needs to be comfortable with children, or that your dates can move.
          </p>
          <p>
            When you send a request, a travel specialist reads it, looks into
            options that fit, and talks them through with you. You make the
            decision — and the booking is only arranged once you have.
          </p>
        </div>
        <Link
          href="/cabs"
          className="group mt-8 inline-flex min-h-11 items-center gap-2 text-[1rem] font-bold text-ink-900 transition-colors duration-200 hover:text-clay-700"
        >
          Need a ride from the airport too?
          <ArrowRight
            aria-hidden="true"
            className="size-[1.125rem] transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transform-none"
            strokeWidth={2.25}
          />
        </Link>
      </SplitFeature>

      <FaqAccordion
        eyebrow="Flight questions"
        title="Good to know before you ask."
        items={FLIGHT_FAQS}
      />

      <FinalCTA
        title="Know where you're flying?"
        lede="Send your route and dates, and a specialist will come back to you with options."
        ctaLabel="Request Flight Options"
        image={FLIGHT_PHOTOS.gateDusk}
      />
    </PageShell>
  );
}
