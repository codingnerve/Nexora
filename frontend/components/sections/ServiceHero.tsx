import Image from "next/image";
import { ArrowRight, Check, Phone } from "lucide-react";
import type { ReactNode } from "react";

import { Reveal } from "@/components/shared/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { EditorialImage } from "@/components/ui/EditorialImage";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { CONTACT, IS_TOLL_FREE_CONFIGURED, toTelHref } from "@/lib/constants";

/**
 * Service page hero.
 *
 * Three layouts, one per service, so the pages do not read as three copies of
 * the same template:
 *
 *   overlay — bold copy over a large rounded photograph. Used for Flights,
 *             the most energetic of the three.
 *   split   — copy on soft sand beside a tall image. Used for Hotels, where a
 *             calmer composition suits the subject.
 *   band    — a panoramic plate with the copy beneath it. Used for Cabs: short,
 *             practical and straight to the point.
 */

type HeroLayout = "overlay" | "split" | "band";

interface ServiceHeroProps {
  layout: HeroLayout;
  eyebrow: string;
  title: string;
  lede: string;
  image: string;
  imageAlt: string;
  /** Label for the primary request action. */
  ctaLabel: string;
  ctaHref?: string;
  /** Split layout only: a smaller second photograph layered over the main one. */
  inset?: { src: string; alt: string };
  /** Split layout only: short labels shown as pills beneath the actions. */
  tags?: readonly string[];
  /** Split layout only: a floating checklist over the main photograph. */
  highlightsTitle?: string;
  highlights?: readonly string[];
  children?: ReactNode;
}

/** Call action shared by all three layouts. */
function CallAction({ onDark }: { onDark: boolean }) {
  if (IS_TOLL_FREE_CONFIGURED) {
    return (
      <ButtonLink
        href={toTelHref(CONTACT.tollFree)}
        variant={onDark ? "secondary" : "phone"}
        size="lg"
        onDark={onDark}
        iconLeft={<Phone />}
        fullWidthOnMobile
        aria-label={`Call toll-free: ${CONTACT.tollFree}`}
      >
        Call Toll-Free
      </ButtonLink>
    );
  }

  return (
    <ButtonLink
      href="/contact"
      variant="secondary"
      size="lg"
      onDark={onDark}
      iconLeft={<Phone />}
      fullWidthOnMobile
    >
      Contact Us
    </ButtonLink>
  );
}

export function ServiceHero({
  layout,
  eyebrow,
  title,
  lede,
  image,
  imageAlt,
  ctaLabel,
  ctaHref = "#plan-your-trip",
  inset,
  tags,
  highlightsTitle = "Matched to your trip",
  highlights,
  children,
}: ServiceHeroProps) {
  const actions = (onDark: boolean) => (
    <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
      <ButtonLink
        href={ctaHref}
        variant="accent"
        size="lg"
        onDark={onDark}
        iconRight={<ArrowRight />}
        fullWidthOnMobile
      >
        {ctaLabel}
      </ButtonLink>
      <CallAction onDark={onDark} />
    </div>
  );

  /* --- Overlay: full-bleed photography ------------------------------------ */
  if (layout === "overlay") {
    return (
      <section aria-labelledby="service-heading" className="pt-4 sm:pt-6">
        <Container>
          <div className="relative isolate overflow-hidden rounded-[24px] bg-ink-900">
            <Image
              src={image}
              alt={imageAlt}
              fill
              loading="eager"
              fetchPriority="high"
              quality={85}
              sizes="(min-width: 1280px) 1200px, 100vw"
              className="-z-10 object-cover object-center"
            />
            {/* Image overlay — the one place a gradient is allowed. */}
            <div
              aria-hidden="true"
              className="absolute inset-0 -z-10 bg-gradient-to-r from-ink-950/85 via-ink-950/55 to-ink-950/10"
            />

            <div className="flex min-h-[clamp(28rem,62vh,36rem)] flex-col justify-end px-6 pb-10 pt-24 sm:px-10 sm:pb-12 lg:px-16 lg:pb-16">
              <div className="max-w-2xl">
                <Eyebrow onDark>{eyebrow}</Eyebrow>

                <h1
                  id="service-heading"
                  className="mt-4 font-display text-display-lg text-white lg:text-display-xl"
                >
                  {title}
                </h1>

                <p className="mt-5 max-w-xl text-body-lg text-white/80">{lede}</p>

                {actions(true)}
                {children}
              </div>
            </div>
          </div>
        </Container>
      </section>
    );
  }

  /* --- Split: calm, layered photography beside the copy ------------------- */
  if (layout === "split") {
    return (
      <section className="bg-canvas-200" aria-labelledby="service-heading">
        <Container>
          <div className="grid items-center gap-10 py-10 lg:grid-cols-12 lg:gap-14 lg:py-14">
            <div className="lg:col-span-6">
              <Eyebrow>{eyebrow}</Eyebrow>

              <h1
                id="service-heading"
                className="mt-4 font-display text-display-lg text-ink-900 lg:text-display-xl"
              >
                {title}
              </h1>

              <p className="mt-5 max-w-lg text-body-lg text-foreground-muted">
                {lede}
              </p>

              {actions(false)}

              {tags && tags.length > 0 ? (
                <div className="mt-9 border-t border-line pt-6">
                  <p className="text-body-sm font-semibold text-foreground-subtle">
                    We help with
                  </p>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <li
                        key={tag}
                        className="rounded-full border border-line bg-surface px-3.5 py-1.5 text-body-sm font-semibold text-ink-800"
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {children}
            </div>

            {/* Main plate, a small inset that overlaps its lower-left corner,
                and a floating note. Fixed heights keep the hero short — a
                portrait ratio at half the page width ran past the fold. */}
            <div className="relative lg:col-span-6">
              <div className="relative h-[17rem] overflow-hidden rounded-[24px] bg-sand-200 sm:h-[24rem] lg:ml-16 lg:h-[30rem]">
                <Image
                  src={image}
                  alt={imageAlt}
                  fill
                  loading="eager"
                  fetchPriority="high"
                  quality={85}
                  sizes="(min-width: 1024px) 44vw, 100vw"
                  className="object-cover object-center"
                />
              </div>

              {inset ? (
                <Reveal
                  delay={0.12}
                  className="absolute -bottom-6 left-0 hidden w-40 sm:block lg:bottom-10 lg:w-44"
                >
                  <div className="relative aspect-[4/5] overflow-hidden rounded-[20px] bg-sand-200 shadow-panel ring-[6px] ring-canvas-200">
                    <Image
                      src={inset.src}
                      alt={inset.alt}
                      fill
                      sizes="176px"
                      className="object-cover"
                    />
                  </div>
                </Reveal>
              ) : null}

              {highlights && highlights.length > 0 ? (
                <Reveal
                  delay={0.2}
                  className="absolute right-4 top-4 hidden w-72 rounded-[16px] bg-white/90 p-4 shadow-panel backdrop-blur-md sm:block lg:right-6 lg:top-6"
                >
                  <p className="text-body-sm font-bold text-ink-900">{highlightsTitle}</p>
                  <ul className="mt-2.5 space-y-2">
                    {highlights.map((item) => (
                      <li
                        key={item}
                        className="flex items-center gap-2.5 text-body-sm text-ink-800"
                      >
                        <span className="grid size-5 shrink-0 place-items-center rounded-full bg-accent-soft text-clay-700">
                          <Check aria-hidden="true" className="size-3" strokeWidth={3} />
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </Reveal>
              ) : null}
            </div>
          </div>
        </Container>
      </section>
    );
  }

  /* --- Band: panoramic plate with the copy beneath ------------------------ */
  return (
    <section aria-labelledby="service-heading">
      <Container>
        <div className="pt-10 lg:pt-14">
          {/* One image, re-cropped by CSS: 3:2 on phones (where 21:9 would be a
              letterbox sliver), panoramic from `sm` up. Rendering two images
              toggled by breakpoint would preload the LCP image twice. */}
          <EditorialImage
            src={image}
            alt={imageAlt}
            ratio="landscape"
            corner="plate"
            priority
            quality={85}
            sizes="100vw"
            className="sm:aspect-[21/9]"
          />
        </div>

        <div className="grid gap-8 pb-4 pt-10 lg:grid-cols-12 lg:gap-16 lg:pt-14">
          <div className="lg:col-span-6">
            <Eyebrow>{eyebrow}</Eyebrow>

            <h1
              id="service-heading"
              className="mt-4 font-display text-display-lg text-ink-900 lg:text-display-xl"
            >
              {title}
            </h1>
          </div>

          <div className="lg:col-span-5 lg:col-start-8">
            <p className="text-body-lg text-foreground-muted">{lede}</p>
            {actions(false)}
            {children}
          </div>
        </div>
      </Container>
    </section>
  );
}
