import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Reveal } from "@/components/shared/Reveal";
import { TRIP_PHOTOS } from "@/lib/images";

/**
 * The brand statement.
 *
 * On desktop the photograph bleeds off the left edge of the viewport and the
 * copy sits in the remaining space, so the section breaks the rhythm of the
 * contained sections around it. On phones it becomes a simple image-then-text
 * stack at a 4:3 crop.
 */
export function EditorialStatement() {
  return (
    <section className="overflow-hidden bg-background py-16 md:py-24 lg:py-0">
      <div className="grid items-center lg:min-h-[40rem] lg:grid-cols-2">
        <Reveal className="px-4 sm:px-8 lg:h-full lg:px-0">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[20px] lg:aspect-auto lg:h-full lg:min-h-[40rem] lg:rounded-none lg:rounded-r-[28px]">
            <Image
              src={TRIP_PHOTOS.mapRoute.src}
              alt={TRIP_PHOTOS.mapRoute.alt}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </Reveal>

        <Reveal delay={0.06} className="px-4 pt-10 sm:px-8 lg:px-16 lg:py-24 xl:px-24">
          <div className="max-w-xl">
            <h2 className="font-display text-display-lg text-ink-900 md:text-display-xl">
              Less time figuring it out.
              <span className="block text-clay-600">More time looking forward to it.</span>
            </h2>
            <p className="mt-7 text-body-lg text-foreground-muted">
              Travel involves enough moving parts. Nexora brings flights, stays
              and transportation assistance together so you can spend less time
              coordinating and more time getting ready to go.
            </p>
            <Link
              href="/about"
              className="group mt-8 inline-flex min-h-11 items-center gap-2 text-[1rem] font-bold text-ink-900 transition-colors duration-200 hover:text-clay-700"
            >
              More about how we work
              <ArrowRight
                aria-hidden="true"
                className="size-[1.125rem] transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transform-none"
                strokeWidth={2.25}
              />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
