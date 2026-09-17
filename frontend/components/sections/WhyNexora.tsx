import { Headphones, ListChecks, MessagesSquare, SlidersHorizontal } from "lucide-react";

import { SplitFeature } from "@/components/sections/SplitFeature";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { VALUE_PROPS } from "@/data/homepage";
import { FLIGHT_PHOTOS } from "@/lib/images";

/**
 * Why people use Nexora — the human-assisted model, explained plainly beside a
 * large photograph with a smaller overlapping one.
 */

const ICONS = [Headphones, ListChecks, SlidersHorizontal, MessagesSquare] as const;

export function WhyNexora() {
  return (
    <SplitFeature
      id="why-nexora"
      image={FLIGHT_PHOTOS.departures}
      inset={FLIGHT_PHOTOS.cabin}
      imageSide="left"
      ratio="portrait"
    >
      <SectionHeading
        eyebrow="Why people use Nexora"
        title="Travel planning is easier when someone is there to help."
        size="lg"
      />
      <p className="mt-5 max-w-xl text-body-lg text-foreground-muted">
        Booking sites leave you to compare everything yourself. With Nexora you
        send one request describing your trip, and a travel specialist works
        through it with you — then helps arrange whatever you decide on.
      </p>

      <dl className="mt-10 grid gap-x-8 sm:grid-cols-2">
        {VALUE_PROPS.map((item, index) => {
          const Icon = ICONS[index] ?? Headphones;
          return (
            <div key={item.title} className="border-t border-line py-6">
              <dt className="flex items-center gap-3 text-body-lg font-bold tracking-[-0.01em] text-ink-900">
                <Icon aria-hidden="true" className="size-5 shrink-0 text-clay-600" strokeWidth={1.75} />
                {item.title}
              </dt>
              <dd className="mt-2 text-body-md text-foreground-muted">{item.description}</dd>
            </div>
          );
        })}
      </dl>
    </SplitFeature>
  );
}
