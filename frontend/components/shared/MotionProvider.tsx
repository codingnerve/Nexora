"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

/**
 * Makes every `motion/react` animation honour `prefers-reduced-motion`.
 *
 * The global CSS rule in globals.css only collapses CSS transitions. Motion
 * drives its animations from JavaScript, so without this it would keep sliding
 * content in for users who have asked the OS to reduce motion. With
 * `reducedMotion="user"`, transform animations are skipped and only opacity
 * changes remain.
 *
 * Children stay Server Components — they are passed through, not re-rendered
 * on the client.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
