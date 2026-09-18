import { ArrowUpRight, Car, Hotel, Plane } from "lucide-react";
import Link from "next/link";

import { Reveal } from "@/components/shared/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import {
  EUROPE_PLACES,
  US_PLACES,
  airportLabel,
  cityLabel,
  flightLabel,
  type PlaceGroup,
  type PopularCity,
} from "@/data/popularPlaces";
import { searchHref, type SearchService } from "@/lib/searchQuery";
import { cn } from "@/utils/cn";

/**
 * Popular places: US cities grouped by state, then a few European countries.
 *
 * Every city is a link to /search with the matching request form pre-filled —
 * the city as the flight destination, the hotel destination, or the cab pickup
 * from its main airport. With `service="all"` (the homepage) each city offers
 * all three.
 */

type Service = SearchService | "all";

const SERVICE_META: Record<SearchService, { label: string; icon: typeof Plane }> = {
  flights: { label: "Flights to", icon: Plane },
  hotels: { label: "Hotels in", icon: Hotel },
  cabs: { label: "Cabs in", icon: Car },
};

function hrefFor(service: SearchService, city: PopularCity, group: PlaceGroup): string {
  if (service === "flights") {
    return searchHref({
      service: "flights",
      tripType: "ROUND_TRIP",
      from: "",
      to: flightLabel(city),
      departureDate: "",
      returnDate: "",
      adults: 1,
      cabinClass: "ECONOMY",
    });
  }
  if (service === "hotels") {
    return searchHref({
      service: "hotels",
      destination: cityLabel(city, group),
      checkIn: "",
      checkOut: "",
      rooms: 1,
      adults: 2,
    });
  }
  return searchHref({
    service: "cabs",
    pickupLocation: airportLabel(city),
    dropoffLocation: cityLabel(city, group),
    date: "",
    time: "",
    passengers: 2,
  });
}

function CityLinks({ service, city, group }: { service: Service; city: PopularCity; group: PlaceGroup }) {
  if (service !== "all") {
    const { label } = SERVICE_META[service];
    return (
      <Link
        href={hrefFor(service, city, group)}
        aria-label={`${label} ${city.name}`}
        className="group/city flex min-h-11 items-center justify-between gap-3 border-t border-line py-2.5 text-body-md font-semibold text-ink-900 transition-colors duration-200 hover:text-clay-700"
      >
        <span>
          {city.name}
          <span className="ml-2 text-[0.8125rem] font-bold tracking-[0.06em] text-stone-500">{city.airportCode}</span>
        </span>
        <ArrowUpRight
          aria-hidden="true"
          className="size-4 shrink-0 text-clay-600 transition-transform duration-200 group-hover/city:-translate-y-0.5 group-hover/city:translate-x-0.5 motion-reduce:transform-none"
          strokeWidth={2.25}
        />
      </Link>
    );
  }

  return (
    <div className="flex min-h-11 items-center justify-between gap-3 border-t border-line py-1.5">
      <span className="text-body-md font-semibold text-ink-900">
        {city.name}
        <span className="ml-2 text-[0.8125rem] font-bold tracking-[0.06em] text-stone-500">{city.airportCode}</span>
      </span>
      <span className="flex shrink-0 gap-1">
        {(Object.keys(SERVICE_META) as SearchService[]).map((key) => {
          const { label, icon: Icon } = SERVICE_META[key];
          return (
            <Link
              key={key}
              href={hrefFor(key, city, group)}
              aria-label={`${label} ${city.name}`}
              title={`${label} ${city.name}`}
              className="grid size-11 place-items-center rounded-full text-stone-600 transition-colors duration-200 hover:bg-sand-200 hover:text-clay-700"
            >
              <Icon aria-hidden="true" className="size-[1.125rem]" strokeWidth={1.75} />
            </Link>
          );
        })}
      </span>
    </div>
  );
}

function GroupCard({ group, service }: { group: PlaceGroup; service: Service }) {
  return (
    <div className="rounded-[20px] border border-line bg-background p-5 sm:p-6">
      <h4 className="mb-2 text-[0.75rem] font-bold uppercase tracking-[0.08em] text-clay-700">{group.region}</h4>
      {group.cities.map((city) => (
        <CityLinks key={city.name} service={service} city={city} group={group} />
      ))}
    </div>
  );
}

function PlaceBlock({
  title,
  lede,
  groups,
  service,
  columns,
}: {
  title: string;
  lede: string;
  groups: readonly PlaceGroup[];
  service: Service;
  columns: 3 | 4;
}) {
  return (
    <div>
      <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
        <h3 className="font-display text-[1.5rem] font-bold tracking-[-0.02em] text-ink-900">{title}</h3>
        <p className="text-body-md text-foreground-muted">{lede}</p>
      </div>
      <div className={cn("mt-5 grid gap-3 sm:grid-cols-2 sm:gap-4", columns === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3")}>
        {groups.map((group) => (
          <GroupCard key={group.region} group={group} service={service} />
        ))}
      </div>
    </div>
  );
}

const DEFAULT_COPY: Record<Service, { title: string; lede: string }> = {
  flights: {
    title: "Popular flight destinations.",
    lede: "Pick a city and we'll start your flight request with it filled in.",
  },
  hotels: {
    title: "Popular places to stay.",
    lede: "Pick a city and we'll start your hotel request with it filled in.",
  },
  cabs: {
    title: "Airport transfers and city rides.",
    lede: "Pick a city and we'll start your request with a pickup from its main airport.",
  },
  all: {
    title: "Top cities across the USA and Europe.",
    lede: "Flights, hotels and cabs for each — pick a city and a service to start your request.",
  },
};

export function PopularPlaces({
  service,
  title,
  lede,
  tone = "muted",
  className,
}: {
  service: Service;
  title?: string;
  lede?: string;
  tone?: "canvas" | "muted" | "sand";
  className?: string;
}) {
  const copy = DEFAULT_COPY[service];
  const usCities = US_PLACES.reduce((n, group) => n + group.cities.length, 0);

  return (
    <Section id="popular-places" tone={tone} space="lg" className={className}>
      <Reveal>
        <SectionHeading eyebrow="Popular places" title={title ?? copy.title} lede={lede ?? copy.lede} size="lg" />
      </Reveal>

      <Reveal className="mt-10 lg:mt-14">
        <PlaceBlock
          title="United States"
          lede={`${usCities} cities across ${US_PLACES.length} states`}
          groups={US_PLACES}
          service={service}
          columns={3}
        />
      </Reveal>

      <Reveal className="mt-12 lg:mt-16" delay={0.06}>
        <PlaceBlock
          title="Europe"
          lede="France, Italy, Spain and the United Kingdom"
          groups={EUROPE_PLACES}
          service={service}
          columns={4}
        />
      </Reveal>
    </Section>
  );
}
