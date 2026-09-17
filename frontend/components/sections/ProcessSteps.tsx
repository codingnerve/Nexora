import { Info } from "lucide-react";

import { Reveal } from "@/components/shared/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/utils/cn";

/**
 * A horizontal numbered process.
 *
 * Large numerals sit on a single rule that runs across the row on desktop, so
 * the steps read as one sequence rather than as separate cards. On phones the
 * steps stack with the rule running down the left edge instead.
 */

export interface ProcessStep {
  readonly title: string;
  readonly description: string;
}

export function ProcessSteps({
  id,
  eyebrow,
  title,
  lede,
  steps,
  note,
  tone = "canvas",
}: {
  id?: string;
  eyebrow?: string;
  title: string;
  lede?: string;
  steps: readonly ProcessStep[];
  /** A plain statement shown under the steps, e.g. that booking is not instant. */
  note?: string;
  tone?: "canvas" | "muted" | "ink";
}) {
  const onDark = tone === "ink";
  const cols = steps.length === 4 ? "md:grid-cols-2 lg:grid-cols-4" : "md:grid-cols-3";

  return (
    <Section id={id} tone={tone} space="lg">
      <Reveal>
        <SectionHeading eyebrow={eyebrow} title={title} lede={lede} size="lg" onDark={onDark} />
      </Reveal>

      <Reveal className="mt-12 lg:mt-16">
        <ol className={cn("grid gap-x-8 gap-y-10 lg:gap-x-10", cols)}>
          {steps.map((step, index) => (
            <li
              key={step.title}
              className={cn(
                "relative border-l pl-6 md:border-l-0 md:border-t md:pl-0 md:pt-7",
                onDark ? "border-white/15" : "border-sand-400"
              )}
            >
              {/* The marker that sits on the rule. */}
              <span
                aria-hidden="true"
                className={cn(
                  "absolute -left-[5px] top-1.5 size-[9px] rounded-full md:-top-[5px] md:left-0",
                  onDark ? "bg-amber-500" : "bg-clay-500"
                )}
              />
              <span
                aria-hidden="true"
                className={cn(
                  "nx-figures block text-[2.25rem] font-extrabold leading-none tracking-[-0.04em] lg:text-[2.75rem]",
                  onDark ? "text-amber-400" : "text-clay-600"
                )}
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3
                className={cn(
                  "mt-4 text-[1.1875rem] font-bold leading-snug tracking-[-0.015em]",
                  onDark ? "text-white" : "text-ink-900"
                )}
              >
                <span className="sr-only">Step {index + 1}: </span>
                {step.title}
              </h3>
              <p
                className={cn(
                  "mt-2 max-w-xs text-body-md",
                  onDark ? "text-white/70" : "text-foreground-muted"
                )}
              >
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </Reveal>

      {note ? (
        <p
          className={cn(
            "mt-12 flex max-w-3xl items-start gap-2.5 border-t pt-6 text-[0.9375rem]",
            onDark ? "border-white/15 text-white/70" : "border-sand-300 text-stone-600"
          )}
        >
          <Info aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          <span>{note}</span>
        </p>
      ) : null}
    </Section>
  );
}
