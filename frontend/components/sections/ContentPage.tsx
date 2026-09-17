import type { ReactNode } from "react";

import { CallToBook } from "@/components/shared/CallToBook";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/SectionHeading";

/**
 * Long-form page layout for About, FAQ and the policy pages.
 *
 * A reading column at a comfortable measure with a quiet sticky aside, rather
 * than a hero and cards — these pages are for reading, and the layout should
 * get out of the way.
 */

export interface ContentBlock {
  readonly heading: string;
  readonly paragraphs: readonly string[];
  readonly list?: readonly string[];
}

export function ContentPage({
  eyebrow,
  title,
  lede,
  blocks,
  aside = true,
  children,
}: {
  eyebrow: string;
  title: string;
  lede: string;
  blocks?: readonly ContentBlock[];
  /** Shows the call panel beside the text on desktop. */
  aside?: boolean;
  children?: ReactNode;
}) {
  return (
    <>
      <header className="bg-canvas-200">
        <Container>
          <div className="max-w-3xl py-14 lg:py-20">
            <Eyebrow>{eyebrow}</Eyebrow>
            <h1 className="mt-5 font-display text-display-lg text-ink-900 lg:text-display-xl">
              {title}
            </h1>
            <p className="mt-6 max-w-2xl text-body-lg text-foreground-muted">{lede}</p>
          </div>
        </Container>
      </header>

      <Section space="lg">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            {blocks?.map((block) => (
              <section key={block.heading} className="border-t border-line py-8 first:border-t-0 first:pt-0">
                <h2 className="font-display text-display-sm text-ink-900">{block.heading}</h2>
                {block.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="mt-4 text-body-md text-foreground-muted">
                    {paragraph}
                  </p>
                ))}
                {block.list ? (
                  <ul className="mt-4 space-y-2.5">
                    {block.list.map((item) => (
                      <li key={item} className="flex gap-3 text-body-md text-foreground-muted">
                        <span aria-hidden="true" className="mt-[0.6rem] size-1.5 shrink-0 rounded-full bg-clay-500" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </section>
            ))}
            {children}
          </div>

          {aside ? (
            <aside className="lg:col-span-4 lg:col-start-9">
              <div className="lg:sticky lg:top-28">
                <CallToBook variant="panel" className="sm:flex-col sm:items-start" />
              </div>
            </aside>
          ) : null}
        </div>
      </Section>
    </>
  );
}
