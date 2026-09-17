import type { LucideIcon } from "lucide-react";

import { Reveal } from "@/components/shared/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/utils/cn";

/**
 * Icon feature grid.
 *
 * Compact cards for practical details — what we ask about, what to have ready,
 * what a specialist plans around. Uses the same lift-on-hover treatment as the
 * homepage hero pillars so the pages feel like one system.
 */

export interface IconFeature {
  readonly icon: LucideIcon;
  readonly title: string;
  readonly body: string;
}

export function IconFeatureGrid({
  id,
  eyebrow,
  title,
  lede,
  items,
  columns = 3,
  tone = "canvas",
  onDark = false,
}: {
  id?: string;
  eyebrow?: string;
  title: string;
  lede?: string;
  items: readonly IconFeature[];
  columns?: 3 | 4;
  tone?: "canvas" | "muted" | "sand";
  /** Renders on the navy band instead of a light surface. */
  onDark?: boolean;
}) {
  return (
    <Section id={id} tone={onDark ? "ink" : tone} space="lg">
      <Reveal>
        <SectionHeading
          eyebrow={eyebrow}
          title={title}
          lede={lede}
          size="lg"
          onDark={onDark}
          align="center"
        />
      </Reveal>

      <Reveal className="mt-12 lg:mt-14">
        <ul
          className={cn(
            "grid gap-4 sm:grid-cols-2 lg:gap-5",
            columns === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"
          )}
        >
          {items.map(({ icon: Icon, title: itemTitle, body }) => (
            <li
              key={itemTitle}
              className={cn(
                "group rounded-[20px] border p-6 transition-[transform,box-shadow,border-color,background-color] duration-300 hover:-translate-y-1 motion-reduce:transform-none sm:p-7",
                onDark
                  ? "border-white/10 bg-white/[0.04] hover:border-amber-500/40 hover:bg-white/[0.07]"
                  : "border-sand-300/80 bg-surface shadow-subtle hover:border-clay-500/30 hover:shadow-raised"
              )}
            >
              <span
                aria-hidden="true"
                className={cn(
                  "flex size-12 items-center justify-center rounded-[14px] transition-colors duration-300",
                  onDark
                    ? "bg-amber-500/15 text-amber-400 group-hover:bg-amber-500 group-hover:text-ink-900"
                    : "bg-clay-500/10 text-clay-600 group-hover:bg-clay-500 group-hover:text-ink-900"
                )}
              >
                <Icon className="size-6" strokeWidth={1.75} />
              </span>
              <h3
                className={cn(
                  "mt-5 text-[1.125rem] font-bold leading-snug tracking-[-0.015em]",
                  onDark ? "text-white" : "text-ink-900"
                )}
              >
                {itemTitle}
              </h3>
              <p
                className={cn(
                  "mt-2 text-body-sm",
                  onDark ? "text-white/70" : "text-foreground-muted"
                )}
              >
                {body}
              </p>
            </li>
          ))}
        </ul>
      </Reveal>
    </Section>
  );
}
