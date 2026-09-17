import { ArrowRight, ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { PageShell } from "@/components/layout/PageShell";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { SplitFeature } from "@/components/sections/SplitFeature";
import { CallButton } from "@/components/shared/CallButton";
import { Reveal } from "@/components/shared/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Eyebrow, SectionHeading } from "@/components/ui/SectionHeading";
import { DISCLOSURE, PLAN_TRIP_HREF } from "@/lib/constants";
import { FLIGHT_PHOTOS, TRIP_PHOTOS } from "@/lib/images";
import { buildMetadata } from "@/lib/seo";

/**
 * /about
 *
 * Hero with overlapping photographs → what Nexora does → a more personal
 * approach (split) → what we help with (index list) → how we work (dark
 * process) → close. Trust is built by explaining the model, not by claims.
 */
export const metadata: Metadata = buildMetadata({
  title: "About Nexora Destinations",
  description:
    "Nexora Destinations helps travellers arrange flights, hotels, cabs and airport transfers with personal assistance. Send a request, talk it through with a travel specialist, then decide.",
  path: "/about",
  image: TRIP_PHOTOS.friendsSunset.src,
});

const HELP_WITH = [
  { title: "Flights", body: "Domestic and international, one-way, return or multi-city.", href: "/flights" },
  { title: "Hotels", body: "City hotels, resorts, family and business stays.", href: "/hotels" },
  { title: "Cabs", body: "City transfers, point-to-point rides and group travel.", href: "/cabs" },
  { title: "Airport transfers", body: "Pickups and drop-offs planned around your flights.", href: "/cabs" },
  { title: "Travel assistance", body: "Trips that combine several of these, or don't fit a single form.", href: "/contact" },
] as const;

const HOW_WE_WORK = [
  { title: "You tell us", description: "Send a request with your destination, dates and what matters to you." },
  { title: "We review", description: "A travel specialist reads it and looks into options that fit." },
  { title: "We discuss options", description: "We contact you by phone or email and talk them through." },
  { title: "You decide", description: "Nothing is booked until you agree. Then we help arrange it." },
] as const;

export default function AboutPage() {
  return (
    <PageShell>
      {/* --- Hero ---------------------------------------------------------- */}
      <section aria-labelledby="about-heading" className="overflow-hidden bg-canvas-200">
        <Container className="grid items-center gap-12 py-14 lg:grid-cols-12 lg:gap-16 lg:py-20">
          <Reveal className="lg:col-span-5">
            <Eyebrow>About Nexora Destinations</Eyebrow>
            <h1 id="about-heading" className="mt-4 font-display text-display-xl text-ink-900">
              Travel planning should feel easier.
            </h1>
            <p className="mt-6 max-w-lg text-body-lg text-foreground-muted">
              We help travellers arrange flights, hotels and rides with a real
              person on the other side of the request.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <ButtonLink href={PLAN_TRIP_HREF} variant="accent" size="lg" iconRight={<ArrowRight />} fullWidthOnMobile>
                Start a Travel Request
              </ButtonLink>
              <CallButton />
            </div>
          </Reveal>

          <Reveal className="lg:col-span-7" delay={0.06}>
            <div className="relative pb-10 sm:pb-16 sm:pr-16">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[24px] bg-sand-300">
                <Image
                  src={TRIP_PHOTOS.friendsSunset.src}
                  alt={TRIP_PHOTOS.friendsSunset.alt}
                  fill
                  preload
                  quality={85}
                  sizes="(min-width: 1024px) 55vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="absolute bottom-0 right-0 hidden aspect-[4/5] w-[38%] overflow-hidden rounded-[18px] border-[6px] border-canvas-200 shadow-panel sm:block">
                <Image
                  src={TRIP_PHOTOS.mapFlatlay.src}
                  alt={TRIP_PHOTOS.mapFlatlay.alt}
                  fill
                  sizes="(min-width: 1024px) 22vw, 38vw"
                  className="object-cover"
                />
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* --- What Nexora does --------------------------------------------- */}
      <Section tone="canvas" space="lg">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-5">
            <SectionHeading eyebrow="What we do" title="What Nexora does." size="lg" />
          </Reveal>
          <Reveal className="space-y-5 text-body-lg text-foreground-muted lg:col-span-7" delay={0.06}>
            <p className="text-[1.25rem] font-semibold leading-relaxed text-ink-900 sm:text-[1.375rem]">
              Nexora Destinations is a travel assistance company. We help
              travellers organise flights, hotel stays, cabs and airport
              transfers in one place.
            </p>
            <p>
              This website doesn&rsquo;t sell tickets or rooms. Instead, you
              tell us about your trip through a short request form or a phone
              call. A travel specialist looks into options that suit your dates,
              budget and preferences, and contacts you to talk them through.
            </p>
            <p>
              When you&rsquo;ve decided what you want, our team helps arrange
              the booking with you. {DISCLOSURE.process}
            </p>
          </Reveal>
        </div>
      </Section>

      {/* --- A more personal approach ------------------------------------- */}
      <SplitFeature image={FLIGHT_PHOTOS.departures} inset={FLIGHT_PHOTOS.lounge} tone="muted" ratio="portrait">
        <SectionHeading eyebrow="Our approach" title="A more personal approach." size="lg" />
        <div className="mt-6 space-y-4 text-body-lg text-foreground-muted">
          <p>
            Most travel websites hand you a list and leave the comparing to you.
            That works for simple trips. It works less well when timings are
            tight, a group has different needs, or you aren&rsquo;t sure where to
            stay.
          </p>
          <p>
            With Nexora you describe what you need in your own words. A
            specialist reads it, asks what&rsquo;s missing, and comes back with
            options that fit — so you can make the decision with someone who
            has looked at the details.
          </p>
        </div>
      </SplitFeature>

      {/* --- What we help with -------------------------------------------- */}
      <Section tone="canvas" space="lg">
        <Reveal>
          <SectionHeading eyebrow="Services" title="What we help with." size="lg" />
        </Reveal>
        <Reveal className="mt-10">
          <ul className="border-b border-line">
            {HELP_WITH.map((item) => (
              <li key={item.title} className="border-t border-line">
                <Link
                  href={item.href}
                  className="group grid items-center gap-2 py-6 sm:grid-cols-12 sm:gap-8 sm:py-7"
                >
                  <span className="text-[1.5rem] font-extrabold tracking-[-0.025em] text-ink-900 transition-colors duration-200 group-hover:text-clay-700 sm:col-span-5 sm:text-[2rem]">
                    {item.title}
                  </span>
                  <span className="text-body-md text-foreground-muted sm:col-span-6">{item.body}</span>
                  <ArrowUpRight
                    aria-hidden="true"
                    className="hidden size-6 justify-self-end text-stone-400 transition-[color,transform] duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-clay-600 sm:col-span-1 sm:block motion-reduce:transform-none"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>
      </Section>

      <ProcessSteps
        tone="ink"
        eyebrow="How we work"
        title="Four steps, and you decide at the end."
        steps={HOW_WE_WORK}
        note="Sending a request is free and doesn't commit you to anything. No payment details are collected on this website."
      />

      <FinalCTA
        title="Have a trip in mind?"
        lede="Start a travel request, or get in touch if you'd rather talk it through first."
        ctaLabel="Start a Travel Request"
        ctaHref={PLAN_TRIP_HREF}
        image={TRIP_PHOTOS.balloons}
      />
    </PageShell>
  );
}
