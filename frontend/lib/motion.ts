import type { Transition, Variants } from "motion/react";

/**
 * The motion system.
 *
 * Deliberately small. Most interaction feedback (hover, focus, press) is plain
 * CSS transition — Framer Motion is reserved for things CSS cannot express
 * well, chiefly the mobile menu's enter/exit and scroll reveals.
 *
 * Rules this system follows:
 *   - only `opacity` and `transform` are animated (never width/height/top/left)
 *   - enter 240-360ms, exit ~65% of that, so dismissal feels responsive
 *   - `prefers-reduced-motion` is honoured globally in globals.css, which
 *     collapses every transition to 0.01ms
 */

/** The brand easing curve, matching `--nx-ease-out`. */
export const EASE_OUT = [0.22, 1, 0.36, 1] as const;
export const EASE_IN_OUT = [0.65, 0, 0.35, 1] as const;

export const DURATION = {
  instant: 0.12,
  fast: 0.18,
  base: 0.24,
  slow: 0.36,
} as const;

export const transition: Transition = {
  duration: DURATION.base,
  ease: EASE_OUT,
};

/** A short rise with a fade. The default entrance for content blocks. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.slow, ease: EASE_OUT },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: DURATION.base, ease: EASE_OUT } },
};

/**
 * Parent variant that reveals children in sequence.
 * 45ms apart — enough to read as a sequence, short enough not to feel slow.
 */
export const staggerChildren: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.045, delayChildren: 0.04 },
  },
};

/** Full-screen mobile menu. Exits faster than it enters. */
export const menuSheet: Variants = {
  hidden: { opacity: 0, y: -12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.base, ease: EASE_OUT },
  },
  exit: {
    opacity: 0,
    y: -12,
    transition: { duration: DURATION.fast, ease: EASE_IN_OUT },
  },
};

/** Individual rows inside the mobile menu. */
export const menuItem: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: DURATION.base, ease: EASE_OUT } },
  exit: { opacity: 0, transition: { duration: DURATION.instant } },
};

/** The sticky mobile call bar, which slides up from the bottom edge. */
export const callBar: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: DURATION.base, ease: EASE_OUT } },
  exit: { opacity: 0, y: 24, transition: { duration: DURATION.fast, ease: EASE_IN_OUT } },
};

/** Shared `whileInView` config so scroll reveals behave identically. */
export const inView = {
  initial: "hidden",
  whileInView: "visible",
  viewport: { once: true, amount: 0.25 },
} as const;
