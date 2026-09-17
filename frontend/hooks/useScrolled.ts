"use client";

import { useEffect, useState } from "react";

/**
 * Tracks whether the page has scrolled past `threshold` pixels.
 *
 * Reads are throttled to one per animation frame so the listener never forces
 * layout on every scroll event, and the listener is passive so it cannot block
 * scrolling.
 */
export function useScrolled(threshold = 24): boolean {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let frame = 0;

    const read = () => {
      frame = 0;
      setScrolled(window.scrollY > threshold);
    };

    const onScroll = () => {
      if (frame === 0) {
        frame = window.requestAnimationFrame(read);
      }
    };

    // Set the initial value: the page may already be scrolled on mount,
    // for example after a browser restores the previous scroll position.
    read();

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [threshold]);

  return scrolled;
}
