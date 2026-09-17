import Image from "next/image";

import { Reveal } from "@/components/shared/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TRIP_PURPOSES } from "@/data/homepage";
import { cn } from "@/utils/cn";

/**
 * Travel by purpose.
 *
 * Four informational categories on an offset grid: the rows alternate wide and
 * narrow columns, and the narrow photographs are taller, so the section reads
 * as an editorial spread rather than four identical cards. Text sits beneath
 * the photographs, not over them.
 */

const LAYOUT = [
  { col: "md:col-span-7", ratio: "aspect-[4/3] md:aspect-[16/10]" },
  { col: "md:col-span-5", ratio: "aspect-[4/3] md:aspect-[5/4]" },
  { col: "md:col-span-5", ratio: "aspect-[4/3] md:aspect-[5/4]" },
  { col: "md:col-span-7", ratio: "aspect-[4/3] md:aspect-[16/10]" },
] as const;

export function TripPurposes() {
  return (
    <Section tone="muted" space="lg">
      <Reveal>
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <SectionHeading
            eyebrow="Travel by purpose"
            title="Different trips need different plans."
            size="lg"
            className="lg:col-span-7"
          />
          <p className="max-w-md text-body-lg text-foreground-muted lg:col-span-5 lg:justify-self-end">
            Whatever kind of trip it is, tell us about it in your own words.
            These are ways of thinking about a trip — not packages.
          </p>
        </div>
      </Reveal>

      <Reveal className="mt-10 lg:mt-14">
        <ul className="grid gap-x-5 gap-y-10 md:grid-cols-12 lg:gap-x-8 lg:gap-y-14">
          {TRIP_PURPOSES.map((purpose, index) => {
            const layout = LAYOUT[index] ?? LAYOUT[0];
            return (
              <li key={purpose.title} className={cn(layout.col, index % 2 === 1 && "md:mt-16")}>
                <div className={cn("group relative overflow-hidden rounded-[20px] bg-sand-300", layout.ratio)}>
                  <Image
                    src={purpose.image.src}
                    alt={purpose.image.alt}
                    fill
                    sizes="(min-width: 1280px) 720px, (min-width: 768px) 55vw, 100vw"
                    className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04] motion-reduce:transform-none"
                  />
                </div>
                <div className="mt-5 flex gap-4">
                  <span aria-hidden="true" className="nx-figures pt-1 text-[0.875rem] font-bold text-clay-600">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="text-[1.375rem] font-bold tracking-[-0.02em] text-ink-900">
                      {purpose.title}
                    </h3>
                    <p className="mt-1.5 max-w-md text-body-md text-foreground-muted">{purpose.body}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </Reveal>
    </Section>
  );
}
