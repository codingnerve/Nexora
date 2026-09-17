import { ArrowRight } from "lucide-react";
import Image from "next/image";

import { Reveal } from "@/components/shared/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/SectionHeading";

/**
 * Full-width photographic band.
 *
 * A pause between denser sections: one striking photograph, a short statement
 * and a single action. The photograph is a rounded plate inside the shell
 * rather than edge-to-edge, matching the service heroes.
 */
export function ImageBand({
  eyebrow,
  title,
  lede,
  image,
  imageAlt,
  ctaLabel,
  ctaHref,
  points,
}: {
  eyebrow?: string;
  title: string;
  lede?: string;
  image: string;
  imageAlt: string;
  ctaLabel?: string;
  ctaHref?: string;
  /** Short facts shown as a row beneath the copy. */
  points?: readonly string[];
}) {
  return (
    <section className="py-6 sm:py-10">
      <Container>
        <Reveal>
          <div className="relative isolate overflow-hidden rounded-[28px] bg-ink-900">
            <Image
              src={image}
              alt={imageAlt}
              fill
              quality={85}
              sizes="(min-width: 1536px) 1500px, 100vw"
              className="-z-10 object-cover"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 -z-10 bg-gradient-to-r from-ink-950/90 via-ink-950/55 to-ink-950/5"
            />

            <div className="flex min-h-[clamp(26rem,58vh,34rem)] flex-col justify-center px-6 py-14 sm:px-12 lg:px-20">
              <div className="max-w-xl">
                {eyebrow ? <Eyebrow onDark>{eyebrow}</Eyebrow> : null}
                <h2 className="mt-4 font-display text-display-md text-white md:text-display-lg">
                  {title}
                </h2>
                {lede ? (
                  <p className="mt-5 text-body-lg text-white/80">{lede}</p>
                ) : null}

                {points?.length ? (
                  <ul className="mt-7 flex flex-wrap gap-2">
                    {points.map((point) => (
                      <li
                        key={point}
                        className="rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-[0.8125rem] font-semibold text-white backdrop-blur-sm"
                      >
                        {point}
                      </li>
                    ))}
                  </ul>
                ) : null}

                {ctaLabel && ctaHref ? (
                  <div className="mt-9">
                    <ButtonLink
                      href={ctaHref}
                      variant="accent"
                      size="lg"
                      onDark
                      iconRight={<ArrowRight />}
                      fullWidthOnMobile
                    >
                      {ctaLabel}
                    </ButtonLink>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
