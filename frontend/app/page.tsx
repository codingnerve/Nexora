import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { PageShell } from "@/components/layout/PageShell";
import { JsonLd } from "@/components/shared/JsonLd";
import { DestinationsSection } from "@/components/sections/DestinationsSection";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { FullBleedBand } from "@/components/sections/FullBleedBand";
import { Hero } from "@/components/sections/Hero";
import { PopularPlaces } from "@/components/sections/PopularPlaces";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { ServiceStrip } from "@/components/sections/ServiceStrip";
import { SplitFeature } from "@/components/sections/SplitFeature";
import { TravelRequest } from "@/components/sections/TravelRequest";
import { TripPurposes } from "@/components/sections/TripPurposes";
import { WhyNexora } from "@/components/sections/WhyNexora";
import { ButtonLink } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PROCESS_STEPS } from "@/data/homepage";
import { SITE } from "@/lib/constants";
import { CAB_PHOTOS, FLIGHT_PHOTOS, HERO_PHOTO, HOTEL_PHOTOS } from "@/lib/images";
import { buildMetadata } from "@/lib/seo";
import { organizationSchema, websiteSchema } from "@/lib/structuredData";

/**
 * Homepage.
 *
 * Section order and layouts alternate deliberately — full-bleed photography,
 * a light form section, an editorial row, a split, a process, a mosaic, an
 * offset grid, a photographic band, an overlapping split, a dark split, a
 * bleeding statement and a dark close — so no two neighbours share a layout.
 *
 * Server Components throughout; the only client JavaScript is the header menu,
 * the inquiry panel, the mobile call bar and the scroll-reveal wrapper.
 */

export const metadata: Metadata = buildMetadata({
  title: `${SITE.name} | Flights, Hotels & Cab Booking Assistance`,
  description:
    "Tell us where you're going. Nexora Destinations' travel specialists help you plan flights, hotel stays, cabs and airport transfers — with personal assistance and no online payment.",
  path: "/",
  image: HERO_PHOTO.src,
});

function TextLink({ href, children, onDark = false }: { href: string; children: string; onDark?: boolean }) {
  return (
    <Link
      href={href}
      className={
        onDark
          ? "nx-focus-dark group inline-flex min-h-11 items-center gap-2 text-[1rem] font-bold text-white transition-colors duration-200 hover:text-amber-400"
          : "group inline-flex min-h-11 items-center gap-2 text-[1rem] font-bold text-ink-900 transition-colors duration-200 hover:text-clay-700"
      }
    >
      {children}
      <ArrowRight
        aria-hidden="true"
        className="size-[1.125rem] transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transform-none"
        strokeWidth={2.25}
      />
    </Link>
  );
}

export default function HomePage() {
  return (
    <PageShell>
      <JsonLd data={[organizationSchema(), websiteSchema()]} />

      <Hero />

      <TravelRequest />

      <ServiceStrip />

      <WhyNexora />

      <ProcessSteps
        id="how-it-works"
        tone="ink"
        eyebrow="How it works"
        title="From request to trip, with a person at every step."
        steps={PROCESS_STEPS}
        note="Nexora does not offer instant online booking or take payment on this website. Every booking is completed manually, only once you've agreed to it."
      />

      <PopularPlaces service="all" />

      <DestinationsSection />

      <TripPurposes />

      {/* --- Flights feature: full-bleed photography ------------------------ */}
      <FullBleedBand
        image={FLIGHT_PHOTOS.wing}
        eyebrow="Flights"
        title="Your journey starts with the right route."
        lede="Tell us where you're flying from, where you're going and when you'd like to travel. Our team can help you work through suitable flight options."
      >
        <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
          <ButtonLink
            href="/flights#plan-your-trip"
            variant="accent"
            size="lg"
            onDark
            iconRight={<ArrowRight />}
            fullWidthOnMobile
          >
            Request Flight Options
          </ButtonLink>
          <TextLink href="/flights" onDark>
            Explore Flights
          </TextLink>
        </div>
      </FullBleedBand>

      {/* --- Hotels feature: overlapping split ------------------------------ */}
      <SplitFeature
        image={HOTEL_PHOTOS.infinityDeck}
        inset={HOTEL_PHOTOS.morningLight}
        imageSide="right"
        ratio="tall"
      >
        <SectionHeading
          eyebrow="Hotels"
          title="A good trip deserves the right place to stay."
          size="lg"
        />
        <p className="mt-5 max-w-lg text-body-lg text-foreground-muted">
          Share your destination, dates and preferences and we&rsquo;ll help you
          explore suitable hotel options — from beach resorts in{" "}
          <Link href="/destinations/bali" className="font-semibold text-ink-900 underline decoration-clay-500 underline-offset-4 hover:text-clay-700">
            Bali
          </Link>{" "}
          and{" "}
          <Link href="/destinations/maldives" className="font-semibold text-ink-900 underline decoration-clay-500 underline-offset-4 hover:text-clay-700">
            the Maldives
          </Link>{" "}
          to city stays in{" "}
          <Link href="/destinations/london" className="font-semibold text-ink-900 underline decoration-clay-500 underline-offset-4 hover:text-clay-700">
            London
          </Link>
          .
        </p>
        <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
          <ButtonLink
            href="/hotels#plan-your-trip"
            variant="primary"
            size="lg"
            iconRight={<ArrowRight />}
            fullWidthOnMobile
          >
            Request Hotel Options
          </ButtonLink>
          <TextLink href="/hotels">Explore Hotels</TextLink>
        </div>
      </SplitFeature>

      {/* --- Cabs feature: dark split ------------------------------------- */}
      <SplitFeature image={CAB_PHOTOS.eveningDrive} imageSide="left" ratio="landscape" tone="ink">
        <SectionHeading
          eyebrow="Cabs & transfers"
          title="Get where you're going without the extra planning."
          size="lg"
          onDark
        />
        <p className="mt-5 max-w-lg text-body-lg text-white/75">
          From airport transfers to local rides, tell us where you need to go
          and we&rsquo;ll help arrange the transportation.
        </p>
        <ul className="mt-7 flex flex-wrap gap-2">
          {["Airport transfers", "City transfers", "Point-to-point", "Group travel"].map((item) => (
            <li
              key={item}
              className="rounded-full border border-white/20 px-3.5 py-1.5 text-[0.8125rem] font-semibold text-white/85"
            >
              {item}
            </li>
          ))}
        </ul>
        <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
          <ButtonLink
            href="/cabs#plan-your-trip"
            variant="accent"
            size="lg"
            onDark
            iconRight={<ArrowRight />}
            fullWidthOnMobile
          >
            Request a Cab
          </ButtonLink>
          <TextLink href="/cabs" onDark>
            Explore Cabs
          </TextLink>
        </div>
      </SplitFeature>

      <FinalCTA
        title="Have a trip in mind?"
        lede="Tell us what you're planning. We'll help you take the next step."
        ctaLabel="Plan My Trip"
        ctaHref="#plan-your-trip"
        image={FLIGHT_PHOTOS.gateDusk}
      />
    </PageShell>
  );
}
