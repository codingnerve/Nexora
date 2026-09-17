"use client";

import { X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef } from "react";

import { CallToBook } from "@/components/shared/CallToBook";
import { Wordmark } from "@/components/shared/Wordmark";
import { ButtonLink } from "@/components/ui/Button";
import { menuItem, menuSheet, staggerChildren } from "@/lib/motion";
import { DISCLOSURE, PLAN_TRIP_HREF, PRIMARY_NAV } from "@/lib/constants";
import { cn } from "@/utils/cn";

const FOCUSABLE =
  'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

/**
 * Full-screen mobile menu.
 *
 * A full sheet rather than a slide-in drawer: with only six destinations there
 * is no hierarchy to preserve, and the full surface lets the links be set
 * large and bold, with the "Plan My Trip" action always in reach at the bottom.
 *
 * Dialog behaviour implemented here: focus moves into the sheet on open,
 * Tab is trapped inside it, Escape closes, background scroll is locked, and
 * focus returns to the trigger on close.
 */
export function MobileNav({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();

  /* Close whenever the route changes, including on back/forward navigation. */
  useEffect(() => {
    if (open) onClose();
    // `onClose` is intentionally omitted: this must fire on pathname change only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  /* Lock background scroll while the sheet is open. */
  useEffect(() => {
    if (!open) return;

    const { body } = document;
    const previousOverflow = body.style.overflow;
    const previousPadding = body.style.paddingRight;

    // Compensate for the scrollbar so the page behind does not shift.
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    body.style.overflow = "hidden";
    if (scrollbarWidth > 0) body.style.paddingRight = `${scrollbarWidth}px`;

    return () => {
      body.style.overflow = previousOverflow;
      body.style.paddingRight = previousPadding;
    };
  }, [open]);

  /* Move focus into the sheet, and restore it to the trigger on close. */
  useEffect(() => {
    if (!open) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    // Wait a tick so the element exists. A timer rather than an animation
    // frame, which can be paused when the browser is not painting.
    const timer = window.setTimeout(() => closeButtonRef.current?.focus(), 0);

    return () => {
      window.clearTimeout(timer);
      previouslyFocused?.focus?.();
    };
  }, [open]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab") return;

      const panel = panelRef.current;
      if (!panel) return;

      const focusable = Array.from(
        panel.querySelectorAll<HTMLElement>(FOCUSABLE)
      ).filter((element) => element.offsetParent !== null);

      if (focusable.length === 0) return;

      const first = focusable[0]!;
      const last = focusable[focusable.length - 1]!;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    },
    [onClose]
  );

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          onKeyDown={handleKeyDown}
          variants={menuSheet}
          initial="hidden"
          animate="visible"
          exit="exit"
          className={cn(
            "fixed inset-0 z-[var(--z-modal)] flex flex-col lg:hidden",
            "bg-white"
          )}
        >
          {/* Header row mirrors the real header so the sheet feels anchored. */}
          <div className="flex h-16 shrink-0 items-center justify-between border-b border-sand-300 px-4 sm:px-8">
            <Wordmark />

            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              className={cn(
                "-mr-2 flex size-11 items-center justify-center rounded-[10px]",
                "text-ink-900 transition-colors duration-[180ms] hover:bg-sand-200"
              )}
            >
              <X aria-hidden="true" className="size-5" strokeWidth={1.75} />
              <span className="sr-only">Close menu</span>
            </button>
          </div>

          <motion.nav
            variants={staggerChildren}
            initial="hidden"
            animate="visible"
            className="flex-1 overflow-y-auto overscroll-contain px-4 py-2 sm:px-8"
            aria-label="Primary"
          >
            <ul>
              {PRIMARY_NAV.map((link) => {
                const isActive =
                  pathname === link.href || pathname.startsWith(`${link.href}/`);

                return (
                  <motion.li
                    key={link.href}
                    variants={menuItem}
                    className="border-b border-sand-300/70 last:border-0"
                  >
                    <Link
                      href={link.href}
                      aria-current={isActive ? "page" : undefined}
                      className={cn(
                        "flex min-h-[3.75rem] items-center gap-3 py-4",
                        "text-[1.375rem] font-bold tracking-[-0.02em] text-ink-900",
                        "transition-colors duration-[180ms] active:text-clay-700"
                      )}
                    >
                      {isActive ? (
                        <span aria-hidden="true" className="size-2 shrink-0 rounded-full bg-clay-500" />
                      ) : null}
                      {link.label}
                    </Link>
                  </motion.li>
                );
              })}
            </ul>
          </motion.nav>

          <div className="shrink-0 space-y-3 border-t border-sand-300 px-4 py-5 sm:px-8 nx-safe-bottom">
            <ButtonLink href={PLAN_TRIP_HREF} variant="accent" size="lg" className="w-full" onClick={onClose}>
              Plan My Trip
            </ButtonLink>
            <CallToBook variant="compact" className="flex min-h-11 justify-center" />
            <p className="text-center text-caption text-stone-600">{DISCLOSURE.short}</p>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
