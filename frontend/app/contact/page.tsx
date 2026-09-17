import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Car, Hotel, Mail, Phone, Plane, Send } from "lucide-react";

import { ContactForm } from "@/components/forms/ContactForm";
import { InquiryCard } from "@/components/forms/InquiryCard";
import { PageShell } from "@/components/layout/PageShell";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { Reveal } from "@/components/shared/Reveal";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Eyebrow, SectionHeading } from "@/components/ui/SectionHeading";
import { CONTACT, DISCLOSURE, IS_TOLL_FREE_CONFIGURED, toTelHref } from "@/lib/constants";
import { TRIP_PHOTOS } from "@/lib/images";
import { buildMetadata } from "@/lib/seo";

/**
 * /contact
 *
 * Everything here — the phone number, the email address, the office address —
 * comes from configuration. A channel whose value is unset is simply not
 * shown, so the page can never display a detail the business has not supplied.
 *
 * Hero → contact options → message form → what happens next → close.
 */
export const metadata: Metadata = buildMetadata({
  title: "Contact",
  description:
    "Talk to Nexora Destinations about your trip. Call us, email us or send a travel request, and a travel specialist will come back to you.",
  path: "/contact",
  image: TRIP_PHOTOS.mapFlatlay.src,
});

const NEXT_STEPS = [
  { title: "We receive your request.", description: "It arrives with our team straight away, with a reference for you to quote." },
  { title: "Our team reviews the details.", description: "A travel specialist reads it and looks into what would suit." },
  { title: "A specialist contacts you.", description: "By phone or email, using the details you give us, to talk through options." },
] as const;

const SERVICE_FORMS = [
  { label: "Flights", href: "/flights#plan-your-trip", icon: Plane },
  { label: "Hotels", href: "/hotels#plan-your-trip", icon: Hotel },
  { label: "Cabs", href: "/cabs#plan-your-trip", icon: Car },
] as const;

export default function ContactPage() {
  const channels = [
    IS_TOLL_FREE_CONFIGURED
      ? {
          icon: Phone,
          label: "Call",
          value: CONTACT.tollFree,
          hint: CONTACT.hours || "Speak to a travel specialist.",
          href: toTelHref(CONTACT.tollFree),
        }
      : null,
    CONTACT.email
      ? {
          icon: Mail,
          label: "Email",
          value: CONTACT.email,
          hint: "For questions about a trip or an existing request.",
          href: `mailto:${CONTACT.email}`,
        }
      : null,
    {
      icon: Send,
      label: "Travel request",
      value: "Send your trip details",
      hint: "Flights, hotels, cabs, or the whole trip.",
      href: "#send-a-message",
    },
  ].filter((channel): channel is NonNullable<typeof channel> => channel !== null);

  return (
    <PageShell>
      {/* --- Hero ---------------------------------------------------------- */}
      <section aria-labelledby="contact-heading" className="overflow-hidden bg-canvas-200">
        <Container className="grid items-center gap-10 py-14 lg:grid-cols-12 lg:gap-16 lg:py-20">
          <Reveal className="lg:col-span-6">
            <Eyebrow>Contact</Eyebrow>
            <h1 id="contact-heading" className="mt-4 font-display text-display-xl text-ink-900">
              Let&rsquo;s talk about your trip.
            </h1>
            <p className="mt-6 max-w-lg text-body-lg text-foreground-muted">
              Send your travel details and a specialist will come back to you.
              {IS_TOLL_FREE_CONFIGURED ? " If your trip is soon, calling is usually quickest." : null}
            </p>
            {CONTACT.address ? (
              <p className="mt-6 max-w-md text-body-sm text-stone-600">{CONTACT.address}</p>
            ) : null}
          </Reveal>
          <Reveal className="lg:col-span-6" delay={0.06}>
            <div className="relative aspect-[4/3] overflow-hidden rounded-[24px] bg-sand-300 lg:aspect-[5/4]">
              <Image
                src={TRIP_PHOTOS.mapFlatlay.src}
                alt={TRIP_PHOTOS.mapFlatlay.alt}
                fill
                preload
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover"
              />
            </div>
          </Reveal>
        </Container>
      </section>

      {/* --- Contact options ---------------------------------------------- */}
      <Section tone="canvas" space="md">
        <Reveal>
          <h2 className="sr-only">Ways to reach us</h2>
          <ul className={channels.length === 3 ? "grid md:grid-cols-3 md:divide-x md:divide-line" : channels.length === 2 ? "grid md:grid-cols-2 md:divide-x md:divide-line" : "grid"}>
            {channels.map(({ icon: Icon, label, value, hint, href }) => (
              <li key={label} className="border-t border-line md:border-t-0 md:px-8 md:first:pl-0 md:last:pr-0">
                <a href={href} className="group flex items-start gap-4 py-6 md:py-2">
                  <span
                    aria-hidden="true"
                    className="flex size-11 shrink-0 items-center justify-center rounded-full bg-clay-500/12 text-clay-700 transition-colors duration-200 group-hover:bg-clay-500 group-hover:text-ink-900"
                  >
                    <Icon className="size-5" strokeWidth={1.75} />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-caption font-bold uppercase tracking-[0.12em] text-stone-500">{label}</span>
                    <span className="nx-figures mt-1 block break-words text-[1.1875rem] font-bold tracking-[-0.01em] text-ink-900 transition-colors duration-200 group-hover:text-clay-700">
                      {value}
                    </span>
                    <span className="mt-1 block text-body-sm text-foreground-muted">{hint}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
      </Section>

      {/* --- Message form ------------------------------------------------- */}
      <Section tone="muted" space="lg">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          <Reveal className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <SectionHeading
                eyebrow="Travel request"
                title="Tell us what you're planning."
                lede="Use this form for questions, whole trips, or anything that doesn't fit a single flight, hotel or cab request."
                size="md"
              />
              <p className="mt-8 text-body-sm font-semibold text-ink-900">
                Know exactly what you need? Use a dedicated request:
              </p>
              <ul className="mt-3 border-b border-sand-400/70">
                {SERVICE_FORMS.map(({ label, href, icon: Icon }) => (
                  <li key={href} className="border-t border-sand-400/70">
                    <Link
                      href={href}
                      className="group flex min-h-12 items-center gap-3 py-3 text-body-md font-semibold text-ink-900 transition-colors duration-200 hover:text-clay-700"
                    >
                      <Icon aria-hidden="true" className="size-[1.125rem] text-clay-600" strokeWidth={1.75} />
                      {label} request
                      <ArrowUpRight
                        aria-hidden="true"
                        className="ml-auto size-4 text-stone-400 transition-colors duration-200 group-hover:text-clay-600"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-caption text-stone-600">{DISCLOSURE.assistance}</p>
            </div>
          </Reveal>

          <Reveal className="lg:col-span-8" delay={0.06}>
            <InquiryCard
              id="send-a-message"
              title="Send us a message"
              lede="No payment required. A specialist will reply using the details you provide."
              className="max-w-none"
            >
              <ContactForm />
            </InquiryCard>
          </Reveal>
        </div>
      </Section>

      <ProcessSteps
        eyebrow="What happens next"
        title="After you get in touch."
        steps={NEXT_STEPS}
        tone="canvas"
      />

      <FinalCTA
        title="Rather talk it through?"
        lede={
          IS_TOLL_FREE_CONFIGURED
            ? "Call us toll-free and a travel specialist will help you work out the next step."
            : "Send us a message and a travel specialist will help you work out the next step."
        }
        ctaLabel="Send a Message"
        ctaHref="#send-a-message"
        image={TRIP_PHOTOS.mapRoute}
      />
    </PageShell>
  );
}
