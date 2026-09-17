import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Reveal } from "@/components/shared/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SERVICES } from "@/data/homepage";

/**
 * The three services, set as an editorial row rather than cards: a tall
 * photograph, a numbered label, one sentence and a text link, divided by
 * hairlines. On phones each service becomes a compact image-and-text row so
 * three tall photographs don't stack into a very long scroll.
 */
export function ServiceStrip({
  eyebrow = "What we help with",
  title = "Flights, hotels and rides — handled with personal assistance.",
  tone = "canvas",
}: {
  eyebrow?: string;
  title?: string;
  tone?: "canvas" | "muted";
}) {
  return (
    <Section tone={tone} space="lg">
      <Reveal>
        <SectionHeading eyebrow={eyebrow} title={title} size="lg" className="max-w-3xl" />
      </Reveal>

      <Reveal className="mt-10 lg:mt-14">
        <ul className="grid gap-6 md:grid-cols-3 md:gap-8 lg:gap-12">
          {SERVICES.map((service, index) => (
            <li key={service.id}>
              <Link
                href={service.href}
                className="group grid grid-cols-[7.5rem_1fr] items-center gap-5 min-[420px]:grid-cols-[9rem_1fr] md:block"
              >
                <span className="relative block aspect-square overflow-hidden rounded-[14px] bg-sand-200 md:aspect-[4/5] md:rounded-[18px]">
                  <Image
                    src={service.image.src}
                    alt={service.image.alt}
                    fill
                    sizes="(min-width: 1280px) 400px, (min-width: 768px) 33vw, 144px"
                    className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04] motion-reduce:transform-none"
                  />
                </span>

                <span className="block md:mt-7">
                  <span className="flex items-baseline gap-3">
                    <span aria-hidden="true" className="nx-figures text-[0.875rem] font-bold text-clay-600">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="text-[0.8125rem] font-bold uppercase tracking-[0.14em] text-ink-900">
                      {service.label}
                    </span>
                  </span>
                  <span className="mt-2.5 block text-body-md text-foreground-muted md:text-body-lg">
                    {service.description}
                  </span>
                  <span className="mt-4 inline-flex items-center gap-2 text-[0.9375rem] font-bold text-ink-900 transition-colors duration-200 group-hover:text-clay-700">
                    {service.linkLabel}
                    <ArrowRight
                      aria-hidden="true"
                      className="size-4 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transform-none"
                      strokeWidth={2.25}
                    />
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Reveal>
    </Section>
  );
}
