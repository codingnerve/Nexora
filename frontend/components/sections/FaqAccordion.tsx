import { ArrowRight, Plus } from "lucide-react";
import Link from "next/link";

import { Reveal } from "@/components/shared/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";

/**
 * Short FAQ block for the homepage and service pages.
 *
 * Native <details>/<summary>, so it is keyboard and screen-reader accessible
 * with no client JavaScript. The full list lives on /faq.
 */
export function FaqAccordion({
  eyebrow = "Questions",
  title = "Good to know before you ask.",
  lede,
  items,
  tone = "canvas",
}: {
  eyebrow?: string;
  title?: string;
  lede?: string;
  items: readonly { question: string; answer: string }[];
  tone?: "canvas" | "muted" | "sand";
}) {
  return (
    <Section tone={tone} space="lg">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-4">
          <Reveal>
            <div className="lg:sticky lg:top-28">
              <SectionHeading eyebrow={eyebrow} title={title} lede={lede} size="md" />
              <Link
                href="/faq"
                className="group/faq mt-6 inline-flex min-h-11 items-center gap-2 text-[0.9375rem] font-bold text-ink-900 transition-colors duration-200 hover:text-clay-700"
              >
                All questions
                <ArrowRight
                  aria-hidden="true"
                  className="size-4 transition-transform duration-300 group-hover/faq:translate-x-1 motion-reduce:transform-none"
                  strokeWidth={2.25}
                />
              </Link>
            </div>
          </Reveal>
        </div>

        <Reveal className="lg:col-span-7 lg:col-start-6" delay={0.06}>
          <div className="divide-y divide-line overflow-hidden rounded-[20px] border border-line bg-surface">
            {items.map((item) => (
              <details key={item.question} className="group/item">
                <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-6 px-5 py-5 text-left transition-colors duration-200 hover:bg-canvas-100 sm:px-7 [&::-webkit-details-marker]:hidden">
                  <span className="text-body-md font-semibold tracking-[-0.01em] text-ink-900 sm:text-body-lg">
                    {item.question}
                  </span>
                  <span
                    aria-hidden="true"
                    className="flex size-8 shrink-0 items-center justify-center rounded-full bg-clay-500/10 text-clay-700 transition-transform duration-300 group-open/item:rotate-45 motion-reduce:transition-none"
                  >
                    <Plus className="size-4" strokeWidth={2.5} />
                  </span>
                </summary>
                <p className="px-5 pb-6 text-body-md text-foreground-muted sm:px-7">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
