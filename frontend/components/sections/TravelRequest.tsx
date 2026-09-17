import { Check } from "lucide-react";

import { InquiryPanel } from "@/components/forms/InquiryPanel";
import { CallToBook } from "@/components/shared/CallToBook";
import { Reveal } from "@/components/shared/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";

/**
 * The homepage travel request — the working Flights / Hotels / Cabs forms,
 * directly after the hero.
 *
 * The explanation sits beside the panel on desktop so it is clear, before
 * anyone starts typing, that this sends a request rather than a booking.
 */

const EXPECTATIONS = [
  "A travel specialist reads every request",
  "You're contacted by phone or email with options",
  "Nothing is booked until you agree",
  "No payment details are collected on this website",
] as const;

export function TravelRequest() {
  return (
    <Section tone="muted" space="lg">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
        <Reveal className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <SectionHeading
              eyebrow="Travel request"
              title="Tell us what you need."
              lede="Share your travel plans and our team will help you work through the options."
              size="lg"
            />

            <ul className="mt-8 space-y-3.5">
              {EXPECTATIONS.map((item) => (
                <li key={item} className="flex items-start gap-3 text-body-md text-stone-700">
                  <span
                    aria-hidden="true"
                    className="mt-1 flex size-5 shrink-0 items-center justify-center rounded-full bg-clay-500/15 text-clay-700"
                  >
                    <Check className="size-3" strokeWidth={3} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>

            <CallToBook variant="panel" className="mt-8 hidden sm:flex-col sm:items-start lg:flex" />
          </div>
        </Reveal>

        <div className="lg:col-span-8">
          <InquiryPanel />
        </div>
      </div>
    </Section>
  );
}
