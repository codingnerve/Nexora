import { ArrowRight } from "lucide-react";
import Image from "next/image";

import { CallButton } from "@/components/shared/CallButton";
import { Reveal } from "@/components/shared/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { CONTACT } from "@/lib/constants";
import type { EditorialPhoto } from "@/lib/images";

/**
 * Closing CTA — the dark navy band just above the footer.
 *
 * A photograph can sit behind it at low opacity, so the band carries some of
 * the page's atmosphere without competing with the copy. The primary action is
 * the request form; the secondary is the toll-free line (or the contact page
 * when no number is configured).
 */
export function FinalCTA({
  title = "Have a trip in mind?",
  lede = "Tell us what you're planning. We'll help you take the next step.",
  ctaLabel = "Plan My Trip",
  // Same-page anchor: on service pages this is their own request form.
  ctaHref = "#plan-your-trip",
  image,
}: {
  title?: string;
  lede?: string;
  ctaLabel?: string;
  ctaHref?: string;
  image?: EditorialPhoto;
} = {}) {
  return (
    <section className="relative isolate overflow-hidden bg-ink-900">
      {image ? (
        <>
          <Image
            src={image.src}
            alt=""
            fill
            sizes="100vw"
            className="-z-10 object-cover opacity-30"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-gradient-to-r from-ink-950 via-ink-950/85 to-ink-900/60"
          />
        </>
      ) : null}

      <Container>
        <Reveal>
          <div className="flex flex-col gap-10 py-20 md:py-24 lg:flex-row lg:items-end lg:justify-between lg:py-28">
            <div className="max-w-2xl">
              <h2 className="font-display text-display-lg text-white md:text-display-xl">
                {title}
              </h2>
              <p className="mt-5 max-w-xl text-body-lg text-white/75">{lede}</p>
            </div>

            <div className="shrink-0">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
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
                <CallButton onDark />
              </div>
              {CONTACT.hours ? (
                <p className="mt-4 text-[0.875rem] text-white/60">{CONTACT.hours}</p>
              ) : null}
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
