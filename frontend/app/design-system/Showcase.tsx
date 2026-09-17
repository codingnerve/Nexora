"use client";

import {
  ArrowRight,
  Compass,
  Handshake,
  Mail,
  MapPin,
  Phone,
  Route,
  Send,
  UserRound,
} from "lucide-react";
import { useState } from "react";

import { ContactCard } from "@/components/cards/ContactCard";
import { InfoCard } from "@/components/cards/InfoCard";
import { ServiceCard } from "@/components/cards/ServiceCard";
import { TravelOptionCard } from "@/components/cards/TravelOptionCard";
import { DestinationCard } from "@/components/destinations/DestinationCard";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { CallToBook } from "@/components/shared/CallToBook";
import {
  MobileCallBar,
  MobileCallBarSpacer,
} from "@/components/shared/MobileCallBar";
import { Button, ButtonLink, type ButtonVariant } from "@/components/ui/Button";
import { DateInput, TimeInput } from "@/components/ui/DateInput";
import { EditorialImage } from "@/components/ui/EditorialImage";
import { Input, Textarea } from "@/components/ui/Input";
import { PhoneInput } from "@/components/ui/PhoneInput";
import { Section } from "@/components/ui/Section";
import { Eyebrow, SectionHeading } from "@/components/ui/SectionHeading";
import { Select } from "@/components/ui/Select";
import {
  CABIN_CLASSES,
  CONTACT,
  TRIP_TYPES,
  VEHICLE_TYPES,
} from "@/lib/constants";
import { DESTINATION_PHOTOS, EDITORIAL_PHOTOS, SERVICE_PHOTOS } from "@/lib/images";

/* --------------------------------------------------------------------------
 * Small helpers used only by this reference page
 * ------------------------------------------------------------------------ */

function Block({
  title,
  note,
  children,
}: {
  title: string;
  note?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-t border-line pt-8">
      <h2 className="font-display text-display-sm text-ink-900">{title}</h2>
      {note ? (
        <p className="mt-2 max-w-2xl text-body-sm text-foreground-muted">{note}</p>
      ) : null}
      <div className="mt-7">{children}</div>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-3 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-stone-600">
      {children}
    </p>
  );
}

const SWATCHES: { token: string; className: string; use: string }[] = [
  { token: "ink-900", className: "bg-ink-900", use: "Primary / dark sections" },
  { token: "ink-800", className: "bg-ink-800", use: "Primary hover" },
  { token: "canvas-100", className: "bg-canvas-100", use: "Page background" },
  { token: "canvas-200", className: "bg-canvas-200", use: "Muted surface" },
  { token: "sand-200", className: "bg-sand-200", use: "Tinted panel" },
  { token: "sand-300", className: "bg-sand-300", use: "Hairlines / borders" },
  { token: "sand-400", className: "bg-sand-400", use: "Strong border" },
  { token: "clay-600", className: "bg-clay-600", use: "Accent (sparing)" },
  { token: "clay-700", className: "bg-clay-700", use: "Accent hover" },
  { token: "amber-500", className: "bg-amber-500", use: "Secondary accent" },
  { token: "stone-500", className: "bg-stone-500", use: "Helper text" },
  { token: "stone-600", className: "bg-stone-600", use: "Muted body text" },
];

const TYPE_SCALE: { name: string; className: string; sample: string }[] = [
  { name: "Display XL", className: "font-display text-display-2xl", sample: "Handled personally" },
  { name: "Display L", className: "font-display text-display-xl", sample: "Handled personally" },
  { name: "Heading XL", className: "font-display text-display-lg", sample: "Where will you go next?" },
  { name: "Heading L", className: "font-display text-display-md", sample: "Where will you go next?" },
  { name: "Heading M", className: "font-display text-display-sm", sample: "Where will you go next?" },
  { name: "Body L", className: "text-body-lg", sample: "Tell us where you're going and we'll help with the details." },
  { name: "Body M", className: "text-body-md", sample: "Tell us where you're going and we'll help with the details." },
  { name: "Body S", className: "text-body-sm", sample: "Tell us where you're going and we'll help with the details." },
  { name: "Caption", className: "text-caption text-stone-500", sample: "No payment required." },
];

const BUTTON_VARIANTS: ButtonVariant[] = [
  "primary",
  "secondary",
  "accent",
  "ghost",
  "text",
  "phone",
];

export function DesignSystemShowcase() {
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState("");

  return (
    <>
      <Header />

      <main>
        {/* --- Page intro ------------------------------------------------- */}
        <Section space="sm">
          <Eyebrow>Internal reference</Eyebrow>
          <h1 className="mt-5 font-display text-display-lg text-ink-900 md:text-display-xl">
            Nexora design system
          </h1>
          <p className="mt-5 max-w-xl text-body-lg text-foreground-muted">
            Every component in the product, in one place. Not linked publicly
            and excluded from search indexing.
          </p>
        </Section>

        <Section space="sm" className="space-y-16">
          {/* --- Colour ---------------------------------------------------- */}
          <Block
            title="Colour"
            note="Defined once in globals.css. Every pair used for text meets WCAG AA; the accent is deliberately rationed."
          >
            <ul className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-6">
              {SWATCHES.map((swatch) => (
                <li key={swatch.token}>
                  <div
                    className={`h-16 rounded-[10px] border border-line ${swatch.className}`}
                  />
                  <p className="mt-2 text-body-sm font-semibold text-ink-900">
                    {swatch.token}
                  </p>
                  <p className="text-caption text-stone-500">{swatch.use}</p>
                </li>
              ))}
            </ul>
          </Block>

          {/* --- Typography ------------------------------------------------ */}
          <Block
            title="Typography"
            note="Manrope throughout: 700–800 for headings with tight tracking, 400–600 for body and UI. Headings are confident but capped in size."
          >
            <div className="space-y-6">
              {TYPE_SCALE.map((step) => (
                <div
                  key={step.name}
                  className="grid gap-2 border-b border-line/60 pb-5 sm:grid-cols-[9rem_1fr] sm:gap-6"
                >
                  <p className="pt-1 text-caption uppercase tracking-[0.12em] text-stone-500">
                    {step.name}
                  </p>
                  <p className={`${step.className} text-ink-900`}>{step.sample}</p>
                </div>
              ))}

              <div className="grid gap-2 sm:grid-cols-[9rem_1fr] sm:gap-6">
                <p className="pt-1 text-caption uppercase tracking-[0.12em] text-stone-500">
                  Eyebrow
                </p>
                <Eyebrow>Where will you go next?</Eyebrow>
              </div>
            </div>
          </Block>

          {/* --- Buttons --------------------------------------------------- */}
          <Block
            title="Buttons"
            note="10px corners, never pills. Hover lifts exactly 1px. The coral 'accent' variant (navy text for contrast) is the primary call to action; 'phone' is white and outlined so calling never looks like submitting."
          >
            <div className="space-y-8">
              <div>
                <Label>Variants</Label>
                <div className="flex flex-wrap items-center gap-4">
                  {BUTTON_VARIANTS.map((variant) => (
                    <Button
                      key={variant}
                      variant={variant}
                      iconRight={variant === "text" ? <ArrowRight /> : undefined}
                      iconLeft={variant === "phone" ? <Phone /> : undefined}
                    >
                      {variant === "phone"
                        ? "1800 000 0000"
                        : variant === "text"
                          ? "Read more"
                          : `${variant[0]!.toUpperCase()}${variant.slice(1)}`}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <Label>Sizes</Label>
                <div className="flex flex-wrap items-center gap-4">
                  <Button size="sm">Small</Button>
                  <Button size="md">Medium</Button>
                  <Button size="lg">Large</Button>
                </div>
              </div>

              <div>
                <Label>States</Label>
                <div className="flex flex-wrap items-center gap-4">
                  <Button iconRight={<ArrowRight />}>With icon</Button>
                  <Button disabled>Disabled</Button>
                  <Button loading loadingLabel="Sending request…">
                    Loading
                  </Button>
                  <Button
                    variant="accent"
                    loading={loading}
                    loadingLabel="Sending request…"
                    iconRight={loading ? undefined : <Send />}
                    onClick={() => {
                      setLoading(true);
                      window.setTimeout(() => setLoading(false), 2200);
                    }}
                  >
                    Click to test loading
                  </Button>
                </div>
              </div>

              <div>
                <Label>Full width on mobile</Label>
                <Button fullWidthOnMobile variant="primary">
                  Send travel request
                </Button>
              </div>

              <div className="rounded-[12px] bg-ink-900 p-6">
                <Label>
                  <span className="text-sand-400">On the dark surface</span>
                </Label>
                <div className="flex flex-wrap items-center gap-4">
                  <Button onDark variant="primary">
                    Primary
                  </Button>
                  <Button onDark variant="secondary">
                    Secondary
                  </Button>
                  <Button onDark variant="accent">
                    Accent
                  </Button>
                  <Button onDark variant="text" iconRight={<ArrowRight />}>
                    Text link
                  </Button>
                  <Button onDark variant="phone" iconLeft={<Phone />}>
                    1800 000 0000
                  </Button>
                </div>
              </div>
            </div>
          </Block>

          {/* --- Form controls --------------------------------------------- */}
          <Block
            title="Form controls"
            note="White fields, a thin grey border and a coral focus ring. Select, date and time use native controls on purpose — they give a real OS picker on mobile and full keyboard and screen-reader support."
          >
            <div className="grid gap-x-6 gap-y-7 md:grid-cols-2">
              <Input
                label="Travelling from"
                placeholder="City or airport"
                required
                icon={<MapPin strokeWidth={1.75} />}
                helper="City name or airport code both work."
              />

              <Input
                label="Full name"
                placeholder="As shown on your passport"
                required
                icon={<UserRound strokeWidth={1.75} />}
              />

              <Select
                label="Trip type"
                required
                placeholder="Choose a trip type"
                defaultValue=""
                options={TRIP_TYPES.map((t) => ({ value: t.value, label: t.label }))}
              />

              <Select
                label="Cabin class"
                required
                defaultValue="ECONOMY"
                options={CABIN_CLASSES.map((c) => ({
                  value: c.value,
                  label: c.label,
                }))}
              />

              <DateInput
                label="Departure date"
                required
                helper="We can't look at dates in the past."
              />

              <TimeInput label="Pickup time" required />

              <PhoneInput
                label="Phone"
                required
                helper="Include your country code so we can reach you."
                onChange={(value) => setPhone(value)}
              />

              <Select
                label="Vehicle type"
                defaultValue=""
                placeholder="No preference"
                options={VEHICLE_TYPES.map((v) => ({
                  value: v.value,
                  label: v.label,
                }))}
              />

              <div className="md:col-span-2">
                <Textarea
                  label="Additional requirements"
                  placeholder="Seat preferences, accessibility needs, anything else we should know."
                  rows={4}
                />
              </div>

              <div className="md:col-span-2">
                <p className="mb-3 text-caption text-stone-500">
                  Composed phone value:{" "}
                  <span className="nx-figures font-semibold text-ink-900">
                    {phone || "—"}
                  </span>
                </p>
              </div>
            </div>

            <div className="mt-10 grid gap-x-6 gap-y-7 md:grid-cols-2">
              <Label>Error and disabled states</Label>
              <div className="md:col-span-2 grid gap-x-6 gap-y-7 md:grid-cols-2">
                <Input
                  label="Email"
                  type="email"
                  required
                  defaultValue="not-an-email"
                  error="Enter a valid email address, for example name@example.com"
                />
                <Select
                  label="Trip type"
                  required
                  defaultValue=""
                  placeholder="Choose a trip type"
                  error="Choose the kind of trip you're planning."
                  options={TRIP_TYPES.map((t) => ({
                    value: t.value,
                    label: t.label,
                  }))}
                />
                <PhoneInput
                  label="Phone"
                  required
                  error="That number looks too short. Check and try again."
                />
                <Input
                  label="Booking reference"
                  disabled
                  defaultValue="NEX-FLT-7A92K1"
                  helper="Assigned automatically once you send the request."
                />
              </div>
            </div>
          </Block>

          {/* --- CallToBook ------------------------------------------------ */}
          <Block
            title="CallToBook"
            note="One component, five placements. The number always comes from NEXT_PUBLIC_TOLL_FREE_NUMBER — it is never written into a component. When unconfigured, each variant falls back to the contact page rather than showing a number nobody can dial."
          >
            <div className="space-y-8">
              <div>
                <Label>inline — header</Label>
                <CallToBook variant="inline" />
              </div>

              <div>
                <Label>panel — beside forms</Label>
                <CallToBook variant="panel" className="max-w-2xl" />
              </div>

              <div>
                <Label>stacked — closing CTA</Label>
                <CallToBook variant="stacked" />
              </div>

              <div>
                <Label>compact — tight spaces</Label>
                <CallToBook variant="compact" />
              </div>

              <div className="rounded-[12px] bg-ink-900 p-6">
                <Label>
                  <span className="text-sand-400">panel + stacked on dark</span>
                </Label>
                <div className="space-y-7">
                  <CallToBook variant="panel" onDark />
                  <CallToBook variant="stacked" onDark />
                </div>
              </div>

              {!CONTACT.tollFree ? (
                <p className="rounded-[10px] border border-sand-300 bg-canvas-200/70 p-4 text-body-sm text-foreground-muted">
                  <strong className="font-semibold text-ink-900">
                    Currently unconfigured.
                  </strong>{" "}
                  The variants above are showing their fallback state. Set{" "}
                  <code className="nx-figures rounded-[8px] bg-sand-200 px-1.5 py-0.5 text-caption">
                    NEXT_PUBLIC_TOLL_FREE_NUMBER
                  </code>{" "}
                  in <code className="text-caption">.env.local</code> to see the
                  real treatment.
                </p>
              ) : null}
            </div>
          </Block>

          {/* --- Image treatment ------------------------------------------- */}
          <Block
            title="Image treatment"
            note="Ratios are chosen per placement, not applied globally, and corners stay near-square so photography reads as a printed plate. Every photo here was viewed to confirm it depicts what its alt text says."
          >
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <Label>portrait 4:5</Label>
                <EditorialImage
                  src={DESTINATION_PHOTOS.bali.src}
                  alt={DESTINATION_PHOTOS.bali.alt}
                  ratio="portrait"
                  sizes="(min-width: 1024px) 22vw, 50vw"
                />
              </div>
              <div>
                <Label>landscape 3:2</Label>
                <EditorialImage
                  src={SERVICE_PHOTOS.flights.src}
                  alt={SERVICE_PHOTOS.flights.alt}
                  ratio="landscape"
                  sizes="(min-width: 1024px) 22vw, 50vw"
                />
              </div>
              <div>
                <Label>square + scrim</Label>
                <EditorialImage
                  src={DESTINATION_PHOTOS.dubai.src}
                  alt={DESTINATION_PHOTOS.dubai.alt}
                  ratio="square"
                  scrim
                  sizes="(min-width: 1024px) 22vw, 50vw"
                >
                  <p className="absolute inset-x-0 bottom-0 p-4 font-display text-display-sm text-canvas-100">
                    Dubai
                  </p>
                </EditorialImage>
              </div>
              <div>
                <Label>wide 16:10 + hover zoom</Label>
                <div className="group">
                  <EditorialImage
                    src={EDITORIAL_PHOTOS.travellers.src}
                    alt={EDITORIAL_PHOTOS.travellers.alt}
                    ratio="wide"
                    zoomOnHover
                    sizes="(min-width: 1024px) 22vw, 50vw"
                  />
                </div>
              </div>
            </div>
          </Block>

          {/* --- Cards ----------------------------------------------------- */}
          <Block
            title="Cards"
            note="Five purpose-built components, not one generic Card. Radius, padding, borders and structure deliberately differ so a page never reads as a uniform grid of tiles."
          >
            <div className="space-y-14">
              <div>
                <Label>DestinationCard — borderless editorial plate</Label>
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                  <DestinationCard
                    name="Dubai"
                    country="United Arab Emirates"
                    description="Skyline views, desert escapes and a short hop from most of the region."
                    image={DESTINATION_PHOTOS.dubai.src}
                    imageAlt={DESTINATION_PHOTOS.dubai.alt}
                    href="/destinations"
                    ratio="portrait"
                  />
                  <DestinationCard
                    name="Maldives"
                    country="Maldives"
                    description="Clear lagoons, island resorts and a pace that slows right down."
                    image={DESTINATION_PHOTOS.maldives.src}
                    imageAlt={DESTINATION_PHOTOS.maldives.alt}
                    href="/destinations"
                    ratio="tall"
                  />
                  <DestinationCard
                    name="Bali"
                    country="Indonesia"
                    description="Temples, rice terraces and coastline, with stays from simple to serious."
                    image={DESTINATION_PHOTOS.bali.src}
                    imageAlt={DESTINATION_PHOTOS.bali.alt}
                    href="/destinations"
                    ratio="portrait"
                  />
                </div>
              </div>

              <div>
                <Label>ServiceCard — numbered, offset, varied crops</Label>
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                  <ServiceCard
                    index={1}
                    title="Flights"
                    description="Tell us where you're headed. We'll help you find suitable flight options."
                    ctaLabel="Plan a flight"
                    href="/flights"
                    image={SERVICE_PHOTOS.flights.src}
                    imageAlt={SERVICE_PHOTOS.flights.alt}
                    ratio="landscape"
                  />
                  <ServiceCard
                    index={2}
                    title="Hotels"
                    description="From quick city stays to longer escapes, tell us what kind of stay you need."
                    ctaLabel="Find a stay"
                    href="/hotels"
                    image={SERVICE_PHOTOS.hotels.src}
                    imageAlt={SERVICE_PHOTOS.hotels.alt}
                    ratio="portrait"
                    offset
                  />
                  <ServiceCard
                    index={3}
                    title="Cabs"
                    description="Airport pickup, city transfers or local travel — we'll help arrange your ride."
                    ctaLabel="Arrange a ride"
                    href="/cabs"
                    image={SERVICE_PHOTOS.cabs.src}
                    imageAlt={SERVICE_PHOTOS.cabs.alt}
                    ratio="landscape"
                  />
                </div>
              </div>

              <div>
                <Label>InfoCard — flat, hairline only, no image</Label>
                <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
                  <InfoCard
                    icon={<UserRound strokeWidth={1.5} />}
                    title="Personal assistance"
                    description="A real travel specialist handles your request."
                  />
                  <InfoCard
                    icon={<Compass strokeWidth={1.5} />}
                    title="Flexible planning"
                    description="Tell us what you need and we'll help explore suitable options."
                  />
                  <InfoCard
                    icon={<Handshake strokeWidth={1.5} />}
                    title="One point of contact"
                    description="Coordinate flights, stays and transfers through one team."
                  />
                  <InfoCard
                    icon={<Route strokeWidth={1.5} />}
                    title="Clear process"
                    description="Know what happens after you send your request."
                  />
                </div>
              </div>

              <div>
                <Label>InfoCard — numbered variant</Label>
                <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
                  <InfoCard
                    index={1}
                    title="Tell us your plans"
                    description="Send your dates, destination and anything else that matters."
                  />
                  <InfoCard
                    index={2}
                    title="We review your request"
                    description="A travel specialist reads it and checks what's possible."
                  />
                  <InfoCard
                    index={3}
                    title="We contact you"
                    description="You get suitable options and decide what works."
                  />
                </div>
              </div>

              <div>
                <Label>TravelOptionCard — enclosed record with accent spine</Label>
                <div className="grid gap-6 lg:grid-cols-2">
                  <TravelOptionCard
                    reference="NEX-FLT-7A92K1"
                    title="Flight request"
                    subtitle="Received — a specialist will be in touch."
                    rows={[
                      { label: "Trip type", value: "Round trip" },
                      { label: "Route", value: "London → Dubai" },
                      { label: "Departing", value: "Fri, 24 Apr 2026" },
                      { label: "Returning", value: "Thu, 30 Apr 2026" },
                      { label: "Travellers", value: "2 adults, 1 child" },
                      { label: "Cabin", value: "Economy" },
                    ]}
                    note="No payment has been taken and no ticket has been issued. Our team will contact you with options."
                  />
                  <TravelOptionCard
                    reference="NEX-CAB-9X73LQ"
                    title="Airport transfer"
                    rows={[
                      { label: "Pickup", value: "Terminal 3, arrivals" },
                      { label: "Drop-off", value: "Downtown hotel" },
                      { label: "Date", value: "Fri, 24 Apr 2026" },
                      { label: "Time", value: "14:30" },
                      { label: "Passengers", value: "3" },
                      { label: "Luggage", value: "4 bags" },
                    ]}
                    footer={
                      <ButtonLink href="/contact" variant="secondary" size="sm">
                        Amend this request
                      </ButtonLink>
                    }
                  />
                </div>
              </div>

              <div>
                <Label>ContactCard — softest surface, hides when unconfigured</Label>
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  <ContactCard
                    icon={<Phone strokeWidth={1.75} />}
                    label="Toll-free"
                    value={CONTACT.tollFree || "1800 000 0000"}
                    href="tel:18000000000"
                    hint={CONTACT.tollFree ? undefined : "Example — not configured"}
                  />
                  <ContactCard
                    icon={<Mail strokeWidth={1.75} />}
                    label="Email"
                    value={CONTACT.email || "hello@example.com"}
                    href="mailto:hello@example.com"
                    hint={CONTACT.email ? undefined : "Example — not configured"}
                  />
                  <ContactCard
                    icon={<MapPin strokeWidth={1.75} />}
                    label="Address"
                    value={CONTACT.address}
                  />
                </div>
                <p className="mt-4 text-caption text-stone-500">
                  The address card renders nothing above because{" "}
                  <code>NEXT_PUBLIC_COMPANY_ADDRESS</code> is unset — that is the
                  intended behaviour, not a bug.
                </p>
              </div>
            </div>
          </Block>

          {/* --- Section tones --------------------------------------------- */}
          <Block
            title="Section tones"
            note="The page is warm ivory throughout. Darkness is rationed to the footer, the closing CTA and the occasional editorial band."
          >
            <div className="space-y-4">
              {(["canvas", "muted", "sand", "ink"] as const).map((tone) => (
                <div
                  key={tone}
                  className={`rounded-[10px] p-6 ${
                    tone === "ink"
                      ? "bg-ink-900 text-canvas-100"
                      : tone === "sand"
                        ? "bg-sand-200"
                        : tone === "muted"
                          ? "bg-canvas-200"
                          : "bg-canvas-100 border border-line"
                  }`}
                >
                  <SectionHeading
                    eyebrow={`tone="${tone}"`}
                    title="Travel plans, handled personally."
                    lede="Flights, stays and rides — tell us what you need and our travel specialists will help arrange the rest."
                    onDark={tone === "ink"}
                    level={3}
                    size="md"
                  />
                </div>
              ))}
            </div>
          </Block>
        </Section>

        <MobileCallBarSpacer />
      </main>

      <Footer />
      <MobileCallBar />
    </>
  );
}
