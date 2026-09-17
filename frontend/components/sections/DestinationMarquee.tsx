import { Sparkle } from "lucide-react";

import { DESTINATIONS } from "@/data/destinations";

/**
 * A slow, continuous ribbon of destination names.
 *
 * Pure CSS: the list is rendered twice and translated by -50% on a loop, so it
 * costs a single compositor animation. It pauses on hover, and under
 * `prefers-reduced-motion` it simply sits still (the global rule collapses the
 * animation). The duplicate copy is hidden from assistive technology.
 */
export function DestinationMarquee() {
  const names = DESTINATIONS.map((destination) => destination.name);

  const row = (hidden: boolean) => (
    <ul
      aria-hidden={hidden || undefined}
      className="flex shrink-0 items-center gap-10 pr-10 sm:gap-14 sm:pr-14"
    >
      {names.map((name) => (
        <li key={name} className="flex items-center gap-10 sm:gap-14">
          <span className="whitespace-nowrap font-display text-[1.75rem] font-extrabold tracking-[-0.03em] text-canvas-100 sm:text-[2.5rem]">
            {name}
          </span>
          <Sparkle aria-hidden="true" className="size-5 shrink-0 text-amber-500" strokeWidth={2} />
        </li>
      ))}
    </ul>
  );

  return (
    <section aria-label="Destinations we help plan" className="overflow-hidden bg-ink-900 py-7 sm:py-9">
      <div className="nx-marquee flex w-max hover:[animation-play-state:paused]">
        {row(false)}
        {row(true)}
      </div>
    </section>
  );
}
