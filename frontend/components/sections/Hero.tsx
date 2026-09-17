import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { HeroSearch } from "@/components/search/HeroSearch";
import { Container } from "@/components/ui/Container";
import { CONTACT, IS_TOLL_FREE_CONFIGURED, toTelHref } from "@/lib/constants";
import { HERO_PHOTO } from "@/lib/images";

/**
 * Homepage hero with the Flights / Hotels / Cabs search bar.
 *
 * Desktop: a full-bleed photograph with the headline over a left-hand scrim and
 * the search bar spanning the width of the banner beneath it.
 * Phones: the photograph at 4:3 on its own, then the headline and search bar
 * on navy — text over a narrow crop is hard to read, and the bar needs width.
 *
 * The photograph is the page's LCP element, so it is the only eagerly loaded
 * image on the homepage.
 */
export function Hero() {
  return (
    <section aria-labelledby="hero-heading" className="relative isolate overflow-hidden bg-ink-900">
      <div className="relative aspect-[4/3] sm:aspect-[16/9] lg:absolute lg:inset-0 lg:aspect-auto">
        <Image
          src={HERO_PHOTO.src}
          alt={HERO_PHOTO.alt}
          fill
          preload
          quality={85}
          sizes="100vw"
          className="object-cover object-[70%_center]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 hidden bg-gradient-to-r from-ink-950/90 via-ink-950/55 to-ink-950/0 lg:block"
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 hidden h-2/5 bg-gradient-to-t from-ink-950/80 to-ink-950/0 lg:block"
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-ink-900 to-ink-900/0 lg:hidden"
        />
      </div>

      <Container className="relative">
        <div className="flex flex-col py-10 sm:py-12 lg:min-h-[clamp(42rem,88vh,50rem)] lg:justify-end lg:pb-14 lg:pt-24">
          <div className="max-w-2xl">
            <p className="text-[0.8125rem] font-bold uppercase tracking-[0.14em] text-amber-400">
              Travel, simplified
            </p>

            <h1 id="hero-heading" className="mt-5 font-display text-display-2xl text-white">
              Travel plans.
              <span className="block text-amber-400">Handled personally.</span>
            </h1>

            <p className="mt-6 max-w-xl text-body-lg text-white/80 sm:text-[1.1875rem]">
              Flights, stays and rides — tell us what you need and our travel
              specialists will help arrange the rest.
            </p>
          </div>

          <HeroSearch className="mt-9 lg:mt-12" />

          <p className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-[0.9375rem] text-white/75">
            <span>Prefer to talk it through?</span>
            {IS_TOLL_FREE_CONFIGURED ? (
              <a
                href={toTelHref(CONTACT.tollFree)}
                className="nx-focus-dark nx-figures inline-flex min-h-11 items-center font-semibold text-white underline decoration-amber-400 underline-offset-4 hover:text-amber-400"
              >
                Call toll-free {CONTACT.tollFree}
              </a>
            ) : (
              <Link
                href="/contact"
                className="nx-focus-dark group inline-flex min-h-11 items-center gap-1.5 font-semibold text-white hover:text-amber-400"
              >
                Contact a travel specialist
                <ArrowRight aria-hidden="true" className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
            )}
          </p>
        </div>
      </Container>
    </section>
  );
}
