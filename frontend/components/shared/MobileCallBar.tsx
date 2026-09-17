"use client";

import { Phone } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import { callBar } from "@/lib/motion";
import { CONTACT, IS_TOLL_FREE_CONFIGURED, toTelHref } from "@/lib/constants";
import { useScrolled } from "@/hooks/useScrolled";
import { cn } from "@/utils/cn";

/**
 * Mobile-only sticky call bar.
 *
 * A single compact "Call Toll-Free" button in a slim strip. It:
 *   - appears only below `lg`, and only after the visitor has scrolled past
 *     the first screen, so it never covers the hero's own call-to-action
 *   - sits above the iOS home indicator via `env(safe-area-inset-bottom)`
 *   - is hidden from assistive tech duplication by being a single link
 *
 * Pages that end in a form must render `<MobileCallBarSpacer />` so the bar
 * cannot sit on top of a submit button.
 */
export function MobileCallBar() {
  const visible = useScrolled(560);

  // With no number configured there is nothing to dial, so show nothing —
  // a bar linking to a page the visitor is probably already on is just noise.
  if (!IS_TOLL_FREE_CONFIGURED) return null;

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          variants={callBar}
          initial="hidden"
          animate="visible"
          exit="exit"
          className={cn(
            "fixed inset-x-0 bottom-0 z-[var(--z-callbar)] lg:hidden",
            "border-t border-sand-300 bg-white/95 backdrop-blur-sm",
            "nx-safe-bottom px-4 pt-2.5"
          )}
        >
          <a
            href={toTelHref(CONTACT.tollFree)}
            aria-label={`Call toll-free: ${CONTACT.tollFree}`}
            className={cn(
              "flex h-12 w-full items-center justify-center gap-2 rounded-[10px]",
              "bg-ink-900 px-5 text-[0.9375rem] font-semibold text-white",
              "transition-colors duration-200 active:bg-ink-950"
            )}
          >
            <Phone aria-hidden="true" className="size-4 text-clay-400" strokeWidth={2} />
            Call Toll-Free
            <span className="nx-figures font-medium text-white/70">{CONTACT.tollFree}</span>
          </a>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

/**
 * Reserves vertical space equal to the call bar so fixed-position content
 * never overlaps the end of a page. Renders nothing on desktop.
 */
export function MobileCallBarSpacer() {
  if (!IS_TOLL_FREE_CONFIGURED) return null;
  return <div aria-hidden="true" className="h-20 lg:hidden" />;
}
