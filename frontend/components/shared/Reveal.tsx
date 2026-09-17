"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

import { fadeUp, inView } from "@/lib/motion";

/**
 * Section-level scroll reveal.
 *
 * Used sparingly and only around whole blocks — never per card, which produces
 * the twitchy "everything animates independently" effect. It runs once, and
 * `prefers-reduced-motion` collapses it to nothing via the global rule in
 * globals.css.
 *
 * This is a client component, but its children are rendered on the server and
 * passed through, so wrapping a section does not turn that section into
 * client-side JavaScript.
 */
export function Reveal({
  children,
  delay = 0,
  className,
  as = "div",
}: {
  children: ReactNode;
  /** Small offset, in seconds, for staggering two adjacent blocks. */
  delay?: number;
  className?: string;
  as?: "div" | "section";
}) {
  const Component = as === "section" ? motion.section : motion.div;

  return (
    <Component
      variants={fadeUp}
      initial={inView.initial}
      whileInView={inView.whileInView}
      viewport={inView.viewport}
      data-reveal=""
      transition={delay ? { delay } : undefined}
      className={className}
    >
      {children}
    </Component>
  );
}
