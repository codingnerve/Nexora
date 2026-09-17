import { Check } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { HotelForm } from "@/components/forms/HotelForm";
import { InquiryCard } from "@/components/forms/InquiryCard";
import { PageShell } from "@/components/layout/PageShell";
import { FaqAccordion } from "@/components/sections/FaqAccordion";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { FullBleedBand } from "@/components/sections/FullBleedBand";
import { NumberedList } from "@/components/sections/NumberedList";
import { PhotoCardGrid } from "@/components/sections/PhotoCardGrid";
import { ServiceHero } from "@/components/sections/ServiceHero";
import { SplitFeature } from "@/components/sections/SplitFeature";
import { Reveal } from "@/components/shared/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { HOTEL_DETAILS, HOTEL_FAQS, HOTEL_TIPS, HOTEL_TYPES } from "@/data/servicePages";
import { HOTEL_PHOTOS } from "@/lib/images";
import { buildMetadata } from "@/lib/seo";

/**
 * /hotels
 *
 * Split hero → request form → stay types (photographic grid) → what we can
 * help with (overlapping split) → location (full-bleed) → planning tips →
 * FAQ → dark close.
 *
 * The stay types are categories for describing a preference. They are not
 * hotels, and the page says so.
 */
export const metadata: Metadata = buildMetadata({
  title: "Hotel Booking Assistance",
  description:
    "Tell Nexora Destinations where you're staying, your dates and what matters to you. Our travel specialists help you explore city hotels, beach resorts and family stays — no online payment.",
  path: "/hotels",
  image: HOTEL_PHOTOS.tropicalResort.src,
});

const STAY_GUIDES = [
  { label: "Dubai", href: "/destinations/dubai" },
  { label: "Bali", href: "/destinations/bali" },
  { label: "Singapore", href: "/destinations/singapore" },
  { label: "Paris", href: "/destinations/paris" },
] as const;

export default function HotelsPage() {
  return (
    <PageShell>
      <ServiceHero
        layout="split"
        eyebrow="Hotels"
        title="Find a stay that fits your trip."
        lede="Tell us where you're staying, your dates and what matters to you. We'll help you explore suitable hotel options."
        image={HOTEL_PHOTOS.tropicalResort.src}
        imageAlt={HOTEL_PHOTOS.tropicalResort.alt}
        ctaLabel="Request Hotel Options"
        inset={HOTEL_PHOTOS.morningLight}
        tags={["City hotels", "Beach resorts", "Business hotels", "Family stays"]}
        highlights={["An area that suits your plans", "Rooms for who's travelling", "Your dates and budget"]}
      />

      {/* --- Request form -------------------------------------------------- */}
      <Section tone="canvas" space="md">
        <Reveal>
          <InquiryCard
            title="Tell us what kind of stay you're looking for."
            lede="Your destination and dates first, then how to reach you. A specialist checks what's available and comes back to you."
          >
            <HotelForm extended />
          </InquiryCard>
        </Reveal>
      </Section>

      <PhotoCardGrid
        eyebrow="Types of stay"
        title="What kind of place suits the trip?"
        lede="Use these as a starting point for describing what you want. They are categories, not a list of available hotels."
        items={HOTEL_TYPES}
        columns={3}
        tone="muted"
      />

      {/* --- What we can help with ---------------------------------------- */}
      <SplitFeature image={HOTEL_PHOTOS.warmRoom} inset={HOTEL_PHOTOS.breakfast} ratio="portrait">
        <SectionHeading
          eyebrow="Your request"
          title="What we can help with."
          lede="Every hotel request can include the details below. Fill in what you know — a specialist will ask about the rest."
          size="lg"
        />
        <ul className="mt-9 grid gap-x-8 sm:grid-cols-2">
          {HOTEL_DETAILS.map((detail) => (
            <li
              key={detail}
              className="flex items-center gap-3 border-t border-line py-4 text-body-md font-semibold text-ink-900"
            >
              <Check aria-hidden="true" className="size-4 shrink-0 text-clay-600" strokeWidth={2.5} />
              {detail}
            </li>
          ))}
        </ul>
      </SplitFeature>

      {/* --- Location ------------------------------------------------------ */}
      <FullBleedBand
        image={HOTEL_PHOTOS.valleyView}
        eyebrow="Where you stay"
        title="The right location can change the whole trip."
        lede="A hotel twenty minutes from everything you came to see costs you time every day. A quiet room matters after a late arrival. A pool matters to children more than a lobby does."
      >
        <p className="mt-5 text-body-lg text-white/80">
          That&rsquo;s why we ask where you want to be and who is travelling —
          not just which star rating you prefer.
        </p>
      </FullBleedBand>

      {/* --- Planning tips ------------------------------------------------- */}
      <Section tone="canvas" space="lg">
        <Reveal>
          <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
            <SectionHeading
              eyebrow="Planning tips"
              title="Details worth mentioning."
              size="lg"
              className="lg:col-span-7"
            />
            <p className="max-w-md text-body-md text-foreground-muted lg:col-span-5 lg:justify-self-end">
              Not sure which area to stay in? Our destination guides cover it for{" "}
              {STAY_GUIDES.map((guide, index) => (
                <span key={guide.href}>
                  <Link
                    href={guide.href}
                    className="font-semibold text-ink-900 underline decoration-clay-500 underline-offset-4 hover:text-clay-700"
                  >
                    {guide.label}
                  </Link>
                  {index < STAY_GUIDES.length - 2 ? ", " : index === STAY_GUIDES.length - 2 ? " and " : "."}
                </span>
              ))}
            </p>
          </div>
        </Reveal>
        <Reveal className="mt-10" delay={0.06}>
          <NumberedList items={HOTEL_TIPS} columns={3} />
        </Reveal>
      </Section>

      <FaqAccordion
        eyebrow="Hotel questions"
        title="Good to know before you ask."
        items={HOTEL_FAQS}
        tone="muted"
      />

      <FinalCTA
        title="Know where you're staying?"
        lede="Send your dates and preferences, and a specialist will come back to you with options."
        ctaLabel="Request Hotel Options"
        image={HOTEL_PHOTOS.resortDusk}
      />
    </PageShell>
  );
}
