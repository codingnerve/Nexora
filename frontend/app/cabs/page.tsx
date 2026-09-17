import {
  ArrowRight,
  Briefcase,
  Building2,
  Luggage,
  MapPinned,
  Plane,
  Users,
  UsersRound,
} from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { CabForm } from "@/components/forms/CabForm";
import { InquiryCard } from "@/components/forms/InquiryCard";
import { PageShell } from "@/components/layout/PageShell";
import { FaqAccordion } from "@/components/sections/FaqAccordion";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { NumberedList } from "@/components/sections/NumberedList";
import { ServiceHero } from "@/components/sections/ServiceHero";
import { SplitFeature } from "@/components/sections/SplitFeature";
import { Reveal } from "@/components/shared/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import {
  CAB_FAQS,
  CAB_PLAN_AHEAD,
  CAB_SERVICE_TYPES,
  CAB_VEHICLE_TYPES,
} from "@/data/servicePages";
import { CAB_PHOTOS, FLIGHT_PHOTOS } from "@/lib/images";
import { buildMetadata } from "@/lib/seo";

/**
 * /cabs
 *
 * Band hero → request form → transportation types (split) → airport transfers
 * (overlapping photographs) → vehicle preferences (dark) → why plan ahead →
 * FAQ → dark close.
 *
 * Vehicle categories mirror the cab form's options exactly. No fleet, models,
 * prices or availability are claimed.
 */
export const metadata: Metadata = buildMetadata({
  title: "Cab & Airport Transfer Assistance",
  description:
    "Airport transfers, city rides and group travel. Tell Nexora Destinations your pickup, drop-off and timing, and our travel specialists will help arrange suitable transportation.",
  path: "/cabs",
  image: CAB_PHOTOS.eveningDrive.src,
});

const TYPE_ICONS = [Plane, Building2, MapPinned, Users, Briefcase, UsersRound] as const;

export default function CabsPage() {
  return (
    <PageShell>
      <ServiceHero
        layout="band"
        eyebrow="Cabs & transfers"
        title="Your ride, sorted."
        lede="From airport transfers to city travel, tell us where you need to go and our team can help arrange suitable transportation."
        image={CAB_PHOTOS.eveningDrive.src}
        imageAlt={CAB_PHOTOS.eveningDrive.alt}
        ctaLabel="Request a Cab"
      />

      {/* --- Request form -------------------------------------------------- */}
      <Section tone="muted" space="md">
        <Reveal>
          <InquiryCard
            title="Tell us where you need to go."
            lede="Pickup, drop-off and timing first, then how to reach you. A specialist confirms the details with you before anything is arranged."
          >
            <CabForm />
          </InquiryCard>
        </Reveal>
      </Section>

      {/* --- Transportation types ----------------------------------------- */}
      <SplitFeature image={CAB_PHOTOS.driverDusk} ratio="tall">
        <SectionHeading
          eyebrow="Transportation"
          title="Rides for the whole trip, not just the airport."
          size="lg"
        />
        <dl className="mt-9 grid gap-x-8 sm:grid-cols-2">
          {CAB_SERVICE_TYPES.map((type, index) => {
            const Icon = TYPE_ICONS[index] ?? MapPinned;
            return (
              <div key={type.title} className="border-t border-line py-5">
                <dt className="flex items-center gap-3 text-body-lg font-bold tracking-[-0.01em] text-ink-900">
                  <Icon aria-hidden="true" className="size-5 shrink-0 text-clay-600" strokeWidth={1.75} />
                  {type.title}
                </dt>
                <dd className="mt-1.5 text-body-md text-foreground-muted">{type.body}</dd>
              </div>
            );
          })}
        </dl>
      </SplitFeature>

      {/* --- Airport transfers -------------------------------------------- */}
      <Section tone="muted" space="lg">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-5">
            <SectionHeading
              eyebrow="Airport transfers"
              title="Arriving somewhere new?"
              lede="Start the trip with transportation arranged around your arrival."
              size="lg"
            />
            <ul className="mt-8 space-y-4">
              {[
                "Enter the airport as your pickup, with the date and time",
                "Add your flight number under additional instructions",
                "Tell us how many passengers and bags are travelling",
              ].map((item) => (
                <li key={item} className="flex gap-3 text-body-md text-stone-700">
                  <Luggage aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-clay-600" strokeWidth={1.75} />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
              <ButtonLink href="#plan-your-trip" variant="primary" size="lg" iconRight={<ArrowRight />} fullWidthOnMobile>
                Request a Transfer
              </ButtonLink>
              <Link
                href="/flights"
                className="group inline-flex min-h-11 items-center gap-2 text-[1rem] font-bold text-ink-900 transition-colors duration-200 hover:text-clay-700"
              >
                Planning the flight too?
                <ArrowRight
                  aria-hidden="true"
                  className="size-[1.125rem] transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transform-none"
                  strokeWidth={2.25}
                />
              </Link>
            </div>
          </Reveal>

          <Reveal className="lg:col-span-7" delay={0.06}>
            <div className="grid grid-cols-5 items-end gap-3 sm:gap-4">
              <div className="relative col-span-3 aspect-[3/4] overflow-hidden rounded-[20px] bg-sand-300">
                <Image
                  src={FLIGHT_PHOTOS.arrival.src}
                  alt={FLIGHT_PHOTOS.arrival.alt}
                  fill
                  sizes="(min-width: 1024px) 34vw, 60vw"
                  className="object-cover"
                />
              </div>
              <div className="col-span-2 space-y-3 sm:space-y-4">
                <div className="relative aspect-[4/5] overflow-hidden rounded-[20px] bg-sand-300">
                  <Image
                    src={CAB_PHOTOS.luggage.src}
                    alt={CAB_PHOTOS.luggage.alt}
                    fill
                    sizes="(min-width: 1024px) 22vw, 40vw"
                    className="object-cover"
                  />
                </div>
                <div className="relative aspect-square overflow-hidden rounded-[20px] bg-sand-300">
                  <Image
                    src={CAB_PHOTOS.navigation.src}
                    alt={CAB_PHOTOS.navigation.alt}
                    fill
                    sizes="(min-width: 1024px) 22vw, 40vw"
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* --- Vehicle preferences ------------------------------------------ */}
      <SplitFeature image={CAB_PHOTOS.suv} imageSide="right" ratio="landscape" tone="ink">
        <SectionHeading
          eyebrow="Vehicle preferences"
          title="Tell us roughly what you need."
          lede="The request form records one of these vehicle types, plus passengers (up to 12) and luggage (up to 12). A specialist confirms the actual vehicle with you."
          size="lg"
          onDark
        />
        <dl className="mt-8">
          {CAB_VEHICLE_TYPES.map((vehicle) => (
            <div
              key={vehicle.title}
              className="flex flex-col gap-1 border-t border-white/15 py-4 sm:flex-row sm:gap-8"
            >
              <dt className="w-40 shrink-0 text-body-md font-bold text-white">{vehicle.title}</dt>
              <dd className="text-body-md text-white/70">{vehicle.body}</dd>
            </div>
          ))}
        </dl>
      </SplitFeature>

      {/* --- Why plan ahead ----------------------------------------------- */}
      <Section tone="canvas" space="lg">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-5">
            <SectionHeading
              eyebrow="Planning ahead"
              title="Why plan transportation ahead?"
              size="lg"
            />
            <div className="relative mt-8 aspect-[4/3] overflow-hidden rounded-[20px] bg-sand-300">
              <Image
                src={CAB_PHOTOS.cityTraffic.src}
                alt={CAB_PHOTOS.cityTraffic.alt}
                fill
                sizes="(min-width: 1024px) 38vw, 100vw"
                className="object-cover"
              />
            </div>
          </Reveal>
          <Reveal className="lg:col-span-7 lg:pt-4" delay={0.06}>
            <NumberedList items={CAB_PLAN_AHEAD} columns={1} />
            <p className="mt-6 text-body-md text-foreground-muted">
              Heading somewhere with a long airport transfer? Our guides to{" "}
              <Link href="/destinations/bali" className="font-semibold text-ink-900 underline decoration-clay-500 underline-offset-4 hover:text-clay-700">
                Bali
              </Link>{" "}
              and{" "}
              <Link href="/destinations/maldives" className="font-semibold text-ink-900 underline decoration-clay-500 underline-offset-4 hover:text-clay-700">
                the Maldives
              </Link>{" "}
              explain how travellers usually get around.
            </p>
          </Reveal>
        </div>
      </Section>

      <FaqAccordion eyebrow="Cab questions" title="Good to know before you ask." items={CAB_FAQS} tone="muted" />

      <FinalCTA
        title="Know where you need to be?"
        lede="Send your pickup, drop-off and time, and we'll help arrange the ride."
        ctaLabel="Request a Cab"
        image={CAB_PHOTOS.saloon}
      />
    </PageShell>
  );
}
