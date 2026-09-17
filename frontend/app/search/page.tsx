import { ArrowRight, CalendarDays, Car, Hotel, Plane, Users } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

import { CabForm } from "@/components/forms/CabForm";
import { FlightForm } from "@/components/forms/FlightForm";
import { HotelForm } from "@/components/forms/HotelForm";
import { InquiryCard } from "@/components/forms/InquiryCard";
import { PageShell } from "@/components/layout/PageShell";
import { HeroSearch } from "@/components/search/HeroSearch";
import { CallToBook } from "@/components/shared/CallToBook";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { CABIN_CLASSES } from "@/lib/constants";
import { parseSearch, type TravelSearch } from "@/lib/searchQuery";
import { buildMetadata } from "@/lib/seo";

/**
 * /search
 *
 * Where the homepage search bar lands. Nexora has no live inventory, so this
 * page does not list fares, rooms or vehicles. It summarises what the visitor
 * searched for and shows the matching request form already filled in; sending
 * it creates a real inquiry through the existing API, exactly like the forms on
 * the service pages.
 *
 * Not indexed: every URL is a one-off combination of search parameters.
 */
export const metadata: Metadata = buildMetadata({
  title: "Your Travel Search",
  description: "Send your flight, hotel or cab search to a Nexora travel specialist.",
  path: "/search",
  noIndex: true,
});

const dateFormat = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
const formatDate = (iso: string) => (iso ? dateFormat.format(new Date(`${iso}T00:00:00Z`)) : "");
const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;
const cabinLabel = (value: string) => CABIN_CLASSES.find((c) => c.value === value)?.label ?? value;

interface Summary {
  icon: ReactNode;
  service: string;
  title: string;
  details: { icon: ReactNode; text: string }[];
  formTitle: string;
  formLede: string;
  servicePage: { href: string; label: string };
}

function summarise(search: TravelSearch): Summary {
  const dateIcon = <CalendarDays aria-hidden="true" className="size-4" />;
  const peopleIcon = <Users aria-hidden="true" className="size-4" />;

  if (search.service === "hotels") {
    const dates = [formatDate(search.checkIn), formatDate(search.checkOut)].filter(Boolean).join(" – ");
    return {
      icon: <Hotel aria-hidden="true" className="size-5" />,
      service: "Hotels",
      title: search.destination ? `Stays in ${search.destination}` : "Find a hotel",
      details: [
        ...(dates ? [{ icon: dateIcon, text: dates }] : []),
        { icon: peopleIcon, text: `${plural(search.rooms, "room")} · ${plural(search.adults, "adult")}` },
      ],
      formTitle: "Request hotel options",
      formLede: "We've filled in your search. Check the details, add any preferences, then tell us how to reach you.",
      servicePage: { href: "/hotels", label: "More about hotel assistance" },
    };
  }

  if (search.service === "cabs") {
    const when = [formatDate(search.date), search.time].filter(Boolean).join(" at ");
    return {
      icon: <Car aria-hidden="true" className="size-5" />,
      service: "Cabs",
      title:
        search.pickupLocation && search.dropoffLocation
          ? `${search.pickupLocation} → ${search.dropoffLocation}`
          : "Arrange a ride",
      details: [
        ...(when ? [{ icon: dateIcon, text: when }] : []),
        { icon: peopleIcon, text: plural(search.passengers, "passenger") },
      ],
      formTitle: "Request a cab",
      formLede: "We've filled in your search. Choose a vehicle type, check the details, then tell us how to reach you.",
      servicePage: { href: "/cabs", label: "More about cabs and transfers" },
    };
  }

  const dates = [formatDate(search.departureDate), search.tripType === "ROUND_TRIP" ? formatDate(search.returnDate) : ""]
    .filter(Boolean)
    .join(" – ");
  return {
    icon: <Plane aria-hidden="true" className="size-5" />,
    service: "Flights",
    title: search.from && search.to ? `${search.from} → ${search.to}` : "Find a flight",
    details: [
      ...(dates ? [{ icon: dateIcon, text: `${dates} · ${search.tripType === "ONE_WAY" ? "One way" : "Round trip"}` }] : []),
      { icon: peopleIcon, text: `${plural(search.adults, "adult")} · ${cabinLabel(search.cabinClass)}` },
    ],
    formTitle: "Request flight options",
    formLede: "We've filled in your search. Add children or infants if they're travelling, then tell us how to reach you.",
    servicePage: { href: "/flights", label: "More about flight assistance" },
  };
}

const NEXT_STEPS = [
  "A travel specialist reviews your request.",
  "They contact you by phone or email with options that fit.",
  "Nothing is booked or charged until you agree.",
] as const;

export default async function SearchPage(props: PageProps<"/search">) {
  const search = parseSearch(await props.searchParams);
  const summary = summarise(search);

  // Keying the form on the search remounts it with fresh defaults when the
  // visitor edits the search and lands back on this page.
  const formKey = JSON.stringify(search);

  return (
    <PageShell>
      {/* --- Search summary ------------------------------------------------ */}
      <section aria-labelledby="search-heading" className="bg-ink-900 text-white">
        <Container className="py-10 sm:py-12 lg:py-14">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-full bg-amber-500/15 text-amber-400">
              {summary.icon}
            </span>
            <Eyebrow onDark as="span">
              {summary.service} search
            </Eyebrow>
          </div>
          <h1 id="search-heading" className="mt-4 break-words font-display text-display-lg text-white">
            {summary.title}
          </h1>
          <ul className="mt-4 flex flex-wrap gap-2">
            {summary.details.map((detail) => (
              <li
                key={detail.text}
                className="nx-figures inline-flex items-center gap-2 rounded-full border border-white/20 px-3.5 py-1.5 text-[0.875rem] font-semibold text-white/85"
              >
                {detail.icon}
                {detail.text}
              </li>
            ))}
          </ul>
          <p className="mt-6 max-w-2xl text-body-md text-white/70">
            We don&rsquo;t show live fares or availability online — they change
            constantly and depend on the details. Send this request and a
            specialist will come back to you with current options.
          </p>

          <details className="group mt-8">
            <summary className="nx-focus-dark inline-flex min-h-11 cursor-pointer list-none items-center gap-2 text-[0.9375rem] font-bold text-white hover:text-amber-400 [&::-webkit-details-marker]:hidden">
              Edit search
              <ArrowRight aria-hidden="true" className="size-4 transition-transform duration-200 group-open:rotate-90" />
            </summary>
            <HeroSearch initial={search} className="mt-4" />
          </details>
        </Container>
      </section>

      {/* --- Pre-filled request -------------------------------------------- */}
      <Section tone="muted" space="lg">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-8">
            <InquiryCard title={summary.formTitle} lede={summary.formLede} className="max-w-none">
              {search.service === "flights" ? (
                <FlightForm
                  key={formKey}
                  extended
                  defaults={{
                    tripType: search.tripType,
                    from: search.from,
                    to: search.to,
                    departureDate: search.departureDate,
                    returnDate: search.returnDate,
                    adults: String(search.adults),
                    cabinClass: search.cabinClass,
                  }}
                />
              ) : search.service === "hotels" ? (
                <HotelForm
                  key={formKey}
                  extended
                  defaults={{
                    destination: search.destination,
                    checkIn: search.checkIn,
                    checkOut: search.checkOut,
                    rooms: String(search.rooms),
                    adults: String(search.adults),
                  }}
                />
              ) : (
                <CabForm
                  key={formKey}
                  defaults={{
                    pickupLocation: search.pickupLocation,
                    dropoffLocation: search.dropoffLocation,
                    date: search.date,
                    time: search.time,
                    passengers: String(search.passengers),
                  }}
                />
              )}
            </InquiryCard>
          </div>

          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <h2 className="text-[1.25rem] font-bold tracking-[-0.015em] text-ink-900">What happens next</h2>
              <ol className="mt-5 space-y-4">
                {NEXT_STEPS.map((step, index) => (
                  <li key={step} className="flex gap-4 border-t border-sand-400/70 pt-4">
                    <span aria-hidden="true" className="nx-figures text-body-md font-extrabold text-clay-600">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="text-body-md text-stone-700">{step}</span>
                  </li>
                ))}
              </ol>

              <CallToBook variant="panel" className="mt-8 sm:flex-col sm:items-start" />

              <Link
                href={summary.servicePage.href}
                className="group mt-6 inline-flex min-h-11 items-center gap-2 text-[0.9375rem] font-bold text-ink-900 transition-colors duration-200 hover:text-clay-700"
              >
                {summary.servicePage.label}
                <ArrowRight
                  aria-hidden="true"
                  className="size-4 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transform-none"
                  strokeWidth={2.25}
                />
              </Link>
            </div>
          </aside>
        </div>
      </Section>
    </PageShell>
  );
}
