import { ArrowUpRight, CalendarDays, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Reveal } from "@/components/shared/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { DESTINATIONS, type Destination } from "@/data/destinations";

/**
 * When to go.
 *
 * A compact planning index built straight from the destination records — the
 * "best time to visit" and "suggested length" notes already written for each
 * destination page — so nothing here is new or unverified copy.
 */

function note(destination: Destination, label: string): string | undefined {
  return destination.planning.find((item) => item.label === label)?.value;
}

export function SeasonGuide({
  eyebrow = "Plan the timing",
  title = "When to go, and for how long.",
  lede = "A quick guide to the seasons and trip lengths that tend to work best. A specialist can help you fit it around your own dates.",
  tone = "muted",
}: {
  eyebrow?: string;
  title?: string;
  lede?: string;
  tone?: "canvas" | "muted" | "sand";
} = {}) {
  return (
    <Section tone={tone} space="lg">
      <Reveal>
        <SectionHeading eyebrow={eyebrow} title={title} lede={lede} size="lg" />
      </Reveal>

      <Reveal className="mt-10 lg:mt-14">
        <ul className="grid gap-4 md:grid-cols-2 lg:gap-5">
          {DESTINATIONS.map((destination) => {
            const season = note(destination, "Best time to visit");
            const length = note(destination, "Suggested length");

            return (
              <li key={destination.slug}>
                <Link
                  href={`/destinations/${destination.slug}`}
                  className="group flex h-full gap-4 rounded-[20px] border border-sand-300/80 bg-surface p-3 pr-5 shadow-subtle transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-0.5 hover:border-clay-500/30 hover:shadow-raised motion-reduce:transform-none sm:gap-5"
                >
                  <span className="relative block w-24 shrink-0 overflow-hidden rounded-[14px] bg-sand-200 sm:w-32">
                    <Image
                      src={destination.gallery.src}
                      alt=""
                      fill
                      sizes="128px"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.06] motion-reduce:transform-none"
                    />
                  </span>

                  <span className="flex min-w-0 flex-1 flex-col justify-center py-2">
                    <span className="flex items-start justify-between gap-3">
                      <span>
                        <span className="block text-[1.125rem] font-bold tracking-[-0.015em] text-ink-900">
                          {destination.name}
                        </span>
                        <span className="block text-caption text-stone-500">
                          {destination.country}
                        </span>
                      </span>
                      <ArrowUpRight
                        aria-hidden="true"
                        className="size-5 shrink-0 text-stone-400 transition-[color,transform] duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-clay-600 motion-reduce:transform-none"
                      />
                    </span>

                    {season ? (
                      <span className="mt-3 flex items-start gap-2 text-body-sm text-stone-700">
                        <CalendarDays aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-clay-600" />
                        <span>{season}</span>
                      </span>
                    ) : null}
                    {length ? (
                      <span className="mt-1.5 flex items-start gap-2 text-body-sm text-stone-600">
                        <Clock aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-amber-500" />
                        <span>{length}</span>
                      </span>
                    ) : null}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </Reveal>
    </Section>
  );
}
