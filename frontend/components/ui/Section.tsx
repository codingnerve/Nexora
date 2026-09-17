import type { ReactNode } from "react";

import { cn } from "@/utils/cn";
import { Container } from "@/components/ui/Container";

/**
 * A page section with consistent vertical rhythm and an optional surface tone.
 *
 * Tone is how the site uses darkness selectively — the page is warm ivory
 * throughout, and `ink` is reserved for the footer, the closing CTA and the
 * occasional editorial band.
 */

type SectionTone = "canvas" | "muted" | "ink" | "sand";
type SectionSpace = "sm" | "md" | "lg" | "none";

const TONES: Record<SectionTone, string> = {
  canvas: "bg-background text-foreground",
  muted: "bg-surface-muted text-foreground",
  sand: "bg-sand-200 text-foreground",
  ink: "bg-ink-900 text-canvas-100",
};

const SPACES: Record<SectionSpace, string> = {
  none: "",
  sm: "py-14 md:py-[var(--spacing-section-sm)]",
  md: "py-16 md:py-[var(--spacing-section-md)]",
  lg: "py-20 md:py-[var(--spacing-section-lg)]",
};

export function Section({
  tone = "canvas",
  space = "md",
  bordered = false,
  className,
  containerClassName,
  contained = true,
  id,
  children,
}: {
  tone?: SectionTone;
  space?: SectionSpace;
  /** Adds the warm hairline that separates stacked light sections. */
  bordered?: boolean;
  className?: string;
  containerClassName?: string;
  /** Set false when the section manages its own full-bleed layout. */
  contained?: boolean;
  id?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className={cn(
        TONES[tone],
        SPACES[space],
        bordered && "border-t border-line",
        className
      )}
    >
      {contained ? (
        <Container className={containerClassName}>{children}</Container>
      ) : (
        children
      )}
    </section>
  );
}
