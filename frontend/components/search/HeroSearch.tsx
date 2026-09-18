"use client";

import { Car, Hotel, Plane, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useId, useRef, useState, type FormEvent, type ReactNode } from "react";

import { Button } from "@/components/ui/Button";
import { addDaysISO, todayISO } from "@/components/ui/DateInput";
import { controlClassName } from "@/components/ui/FormField";
import { POPULAR_CITIES, airportLabel, cityLabel } from "@/data/popularPlaces";
import { POPULAR_AIRPORTS } from "@/lib/airports";
import { CABIN_CLASSES } from "@/lib/constants";
import {
  searchHref,
  type CabSearch,
  type FlightSearch,
  type HotelSearch,
  type SearchService,
  type TravelSearch,
} from "@/lib/searchQuery";
import { MAX_LENGTH } from "@/lib/validation";
import type { CabinClass } from "@/types/inquiry";
import { cn } from "@/utils/cn";

/**
 * The homepage search bar: Flights, Hotels and Cabs.
 *
 * "Search" opens /search with the details carried in the URL, where the
 * matching request form is shown already filled in. Nothing here queries
 * fares, rooms or vehicles — there is no inventory to query — so the bar never
 * implies live availability.
 *
 * Tabs follow the ARIA tabs pattern (arrow keys, Home, End). Required fields
 * use native constraint validation, which is enough for a hand-off to a form
 * that validates everything again.
 */

const TABS: { id: SearchService; label: string; icon: ReactNode }[] = [
  { id: "flights", label: "Flights", icon: <Plane strokeWidth={1.75} /> },
  { id: "hotels", label: "Hotels", icon: <Hotel strokeWidth={1.75} /> },
  { id: "cabs", label: "Cabs", icon: <Car strokeWidth={1.75} /> },
];

const range = (from: number, to: number) =>
  Array.from({ length: to - from + 1 }, (_, i) => from + i);

/** Cab pickup / drop-off suggestions: each popular city's airport, then the city itself. */
const CAB_PLACES = [
  ...new Set([
    ...POPULAR_CITIES.map((city) => airportLabel(city)),
    ...POPULAR_CITIES.map((city) => cityLabel(city, city)),
  ]),
];

const CONTROL = cn(controlClassName(false), "h-12 text-[0.9375rem]");

/** A compact labelled control. The label is always visible. */
function Field({
  label,
  htmlFor,
  className,
  children,
}: {
  label: string;
  htmlFor: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("flex min-w-0 flex-col", className)}>
      <label
        htmlFor={htmlFor}
        className="mb-1.5 text-[0.75rem] font-bold uppercase tracking-[0.08em] text-stone-600"
      >
        {label}
      </label>
      {children}
    </div>
  );
}

function SubmitButton({ label }: { label: string }) {
  return (
    <Button
      type="submit"
      variant="accent"
      size="lg"
      iconLeft={<Search />}
      className="h-12 w-full lg:w-auto lg:px-7"
    >
      {label}
    </Button>
  );
}

export function HeroSearch({
  initial,
  className,
}: {
  /** Pre-fills the bar, e.g. when editing a search on /search. */
  initial?: TravelSearch;
  className?: string;
}) {
  const router = useRouter();
  const uid = useId();
  const id = (name: string) => `${uid}-${name}`;
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const today = todayISO();

  const [active, setActive] = useState<SearchService>(initial?.service ?? "flights");

  const [flight, setFlight] = useState<FlightSearch>(
    initial?.service === "flights"
      ? initial
      : {
          service: "flights",
          tripType: "ROUND_TRIP",
          from: "",
          to: "",
          departureDate: "",
          returnDate: "",
          adults: 1,
          cabinClass: "ECONOMY",
        }
  );
  const [hotel, setHotel] = useState<HotelSearch>(
    initial?.service === "hotels"
      ? initial
      : { service: "hotels", destination: "", checkIn: "", checkOut: "", rooms: 1, adults: 2 }
  );
  const [cab, setCab] = useState<CabSearch>(
    initial?.service === "cabs"
      ? initial
      : { service: "cabs", pickupLocation: "", dropoffLocation: "", date: "", time: "", passengers: 2 }
  );

  const onTabKeyDown = useCallback((event: React.KeyboardEvent, index: number) => {
    const last = TABS.length - 1;
    let next: number | null = null;
    if (event.key === "ArrowRight") next = index === last ? 0 : index + 1;
    else if (event.key === "ArrowLeft") next = index === 0 ? last : index - 1;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = last;
    if (next === null) return;
    event.preventDefault();
    const target = TABS[next]!;
    setActive(target.id);
    tabRefs.current[target.id]?.focus();
  }, []);

  const go = (search: TravelSearch) => (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    router.push(searchHref(search));
  };

  return (
    <div
      className={cn(
        "overflow-hidden rounded-[18px] border border-sand-300 bg-canvas-50 text-ink-900 shadow-panel",
        className
      )}
    >
      {/* --- Tabs --------------------------------------------------------- */}
      <div className="flex items-center justify-between gap-4 border-b border-sand-300 px-3 sm:px-5">
        <div role="tablist" aria-label="What would you like to search for?" className="flex">
          {TABS.map((tab, index) => {
            const selected = tab.id === active;
            return (
              <button
                key={tab.id}
                ref={(node) => {
                  tabRefs.current[tab.id] = node;
                }}
                type="button"
                role="tab"
                id={id(`tab-${tab.id}`)}
                aria-selected={selected}
                aria-controls={id(`panel-${tab.id}`)}
                tabIndex={selected ? 0 : -1}
                onClick={() => setActive(tab.id)}
                onKeyDown={(event) => onTabKeyDown(event, index)}
                className={cn(
                  "relative flex min-h-12 items-center gap-2 px-3 py-3 text-[0.9375rem] font-semibold transition-colors duration-200 sm:px-4",
                  selected ? "text-ink-900" : "text-stone-600 hover:text-ink-900"
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn("[&>svg]:size-[1.125rem]", selected ? "text-clay-600" : "text-stone-500")}
                >
                  {tab.icon}
                </span>
                {tab.label}
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute inset-x-2 -bottom-px h-[3px] rounded-full bg-clay-500 transition-transform duration-300",
                    selected ? "scale-x-100" : "scale-x-0"
                  )}
                />
              </button>
            );
          })}
        </div>
        <p className="hidden text-caption text-stone-500 md:block">
          No payment · A specialist confirms options with you
        </p>
      </div>

      <div className="p-4 sm:p-5">
        {/* --- Flights ---------------------------------------------------- */}
        <div role="tabpanel" id={id("panel-flights")} aria-labelledby={id("tab-flights")} hidden={active !== "flights"}>
          {active === "flights" ? (
            <form onSubmit={go(flight)}>
              <fieldset className="mb-4 flex gap-1.5">
                <legend className="sr-only">Trip type</legend>
                {(
                  [
                    ["ROUND_TRIP", "Round trip"],
                    ["ONE_WAY", "One way"],
                  ] as const
                ).map(([value, label]) => (
                  <label
                    key={value}
                    className={cn(
                      "cursor-pointer rounded-full border px-3.5 py-1.5 text-[0.8125rem] font-semibold transition-colors duration-200 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-clay-600",
                      flight.tripType === value
                        ? "border-ink-900 bg-ink-900 text-white"
                        : "border-sand-400 text-stone-700 hover:border-ink-900/40"
                    )}
                  >
                    <input
                      type="radio"
                      name={id("trip")}
                      value={value}
                      checked={flight.tripType === value}
                      onChange={() => setFlight((f) => ({ ...f, tripType: value }))}
                      className="sr-only"
                    />
                    {label}
                  </label>
                ))}
              </fieldset>

              <datalist id={id("airports")}>
                {POPULAR_AIRPORTS.map((airport) => (
                  <option key={airport.code} value={`${airport.city} (${airport.code})`}>
                    {airport.name}, {airport.country}
                  </option>
                ))}
              </datalist>

              <div className="grid grid-cols-2 gap-3 lg:grid-cols-6 xl:grid-cols-[1.3fr_1.3fr_1fr_1fr_0.7fr_1fr_auto] xl:items-end">
                <Field label="From" htmlFor={id("from")} className="col-span-2 sm:col-span-1 lg:col-span-3 xl:col-span-1">
                  <input
                    id={id("from")}
                    required
                    list={id("airports")}
                    maxLength={MAX_LENGTH.place}
                    autoComplete="off"
                    placeholder="City or airport"
                    value={flight.from}
                    onChange={(e) => setFlight((f) => ({ ...f, from: e.target.value }))}
                    className={CONTROL}
                  />
                </Field>
                <Field label="To" htmlFor={id("to")} className="col-span-2 sm:col-span-1 lg:col-span-3 xl:col-span-1">
                  <input
                    id={id("to")}
                    required
                    list={id("airports")}
                    maxLength={MAX_LENGTH.place}
                    autoComplete="off"
                    placeholder="City or airport"
                    value={flight.to}
                    onChange={(e) => setFlight((f) => ({ ...f, to: e.target.value }))}
                    className={CONTROL}
                  />
                </Field>
                <Field label="Depart" htmlFor={id("depart")} className="col-span-2 min-[400px]:col-span-1 lg:col-span-2 xl:col-span-1">
                  <input
                    id={id("depart")}
                    type="date"
                    required
                    min={today}
                    value={flight.departureDate}
                    onChange={(e) => setFlight((f) => ({ ...f, departureDate: e.target.value }))}
                    className={cn(CONTROL, "nx-figures")}
                  />
                </Field>
                <Field label="Return" htmlFor={id("return")} className="col-span-2 min-[400px]:col-span-1 lg:col-span-2 xl:col-span-1">
                  <input
                    id={id("return")}
                    type="date"
                    required={flight.tripType === "ROUND_TRIP"}
                    disabled={flight.tripType !== "ROUND_TRIP"}
                    min={flight.departureDate || today}
                    value={flight.tripType === "ROUND_TRIP" ? flight.returnDate : ""}
                    onChange={(e) => setFlight((f) => ({ ...f, returnDate: e.target.value }))}
                    className={cn(CONTROL, "nx-figures")}
                  />
                </Field>
                <Field label="Adults" htmlFor={id("adults")} className="lg:col-span-1">
                  <select
                    id={id("adults")}
                    value={flight.adults}
                    onChange={(e) => setFlight((f) => ({ ...f, adults: Number(e.target.value) }))}
                    className={cn(CONTROL, "nx-select cursor-pointer")}
                  >
                    {range(1, 9).map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Cabin" htmlFor={id("cabin")} className="lg:col-span-1">
                  <select
                    id={id("cabin")}
                    value={flight.cabinClass}
                    onChange={(e) => setFlight((f) => ({ ...f, cabinClass: e.target.value as CabinClass }))}
                    className={cn(CONTROL, "nx-select cursor-pointer")}
                  >
                    {CABIN_CLASSES.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </Field>
                <div className="col-span-2 flex items-end lg:col-span-6 xl:col-span-1">
                  <SubmitButton label="Search Flights" />
                </div>
              </div>
            </form>
          ) : null}
        </div>

        {/* --- Hotels ----------------------------------------------------- */}
        <div role="tabpanel" id={id("panel-hotels")} aria-labelledby={id("tab-hotels")} hidden={active !== "hotels"}>
          {active === "hotels" ? (
            <form onSubmit={go(hotel)}>
              <datalist id={id("cities")}>
                {POPULAR_CITIES.map((city) => (
                  <option key={`${city.name}-${city.region}`} value={cityLabel(city, city)} />
                ))}
              </datalist>

              <div className="grid grid-cols-2 gap-3 lg:grid-cols-[2fr_1fr_1fr_0.7fr_0.7fr_auto] lg:items-end">
                <Field label="Destination" htmlFor={id("destination")} className="col-span-2 lg:col-span-1">
                  <input
                    id={id("destination")}
                    required
                    list={id("cities")}
                    maxLength={MAX_LENGTH.place}
                    autoComplete="off"
                    placeholder="City, area or hotel name"
                    value={hotel.destination}
                    onChange={(e) => setHotel((h) => ({ ...h, destination: e.target.value }))}
                    className={CONTROL}
                  />
                </Field>
                <Field label="Check-in" htmlFor={id("checkin")} className="col-span-2 min-[400px]:col-span-1 lg:col-span-1">
                  <input
                    id={id("checkin")}
                    type="date"
                    required
                    min={today}
                    value={hotel.checkIn}
                    onChange={(e) => setHotel((h) => ({ ...h, checkIn: e.target.value }))}
                    className={cn(CONTROL, "nx-figures")}
                  />
                </Field>
                <Field label="Check-out" htmlFor={id("checkout")} className="col-span-2 min-[400px]:col-span-1 lg:col-span-1">
                  <input
                    id={id("checkout")}
                    type="date"
                    required
                    min={hotel.checkIn ? addDaysISO(hotel.checkIn, 1) : today}
                    value={hotel.checkOut}
                    onChange={(e) => setHotel((h) => ({ ...h, checkOut: e.target.value }))}
                    className={cn(CONTROL, "nx-figures")}
                  />
                </Field>
                <Field label="Rooms" htmlFor={id("rooms")}>
                  <select
                    id={id("rooms")}
                    value={hotel.rooms}
                    onChange={(e) => setHotel((h) => ({ ...h, rooms: Number(e.target.value) }))}
                    className={cn(CONTROL, "nx-select cursor-pointer")}
                  >
                    {range(1, 8).map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Adults" htmlFor={id("guests")}>
                  <select
                    id={id("guests")}
                    value={hotel.adults}
                    onChange={(e) => setHotel((h) => ({ ...h, adults: Number(e.target.value) }))}
                    className={cn(CONTROL, "nx-select cursor-pointer")}
                  >
                    {range(1, 12).map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </Field>
                <div className="col-span-2 flex items-end lg:col-span-1">
                  <SubmitButton label="Search Hotels" />
                </div>
              </div>
            </form>
          ) : null}
        </div>

        {/* --- Cabs ------------------------------------------------------- */}
        <div role="tabpanel" id={id("panel-cabs")} aria-labelledby={id("tab-cabs")} hidden={active !== "cabs"}>
          {active === "cabs" ? (
            <form onSubmit={go(cab)}>
              <datalist id={id("cab-places")}>
                {CAB_PLACES.map((place) => (
                  <option key={place} value={place} />
                ))}
              </datalist>

              <div className="grid grid-cols-2 gap-3 lg:grid-cols-[1.5fr_1.5fr_1fr_0.8fr_0.7fr_auto] lg:items-end">
                <Field label="Pickup" htmlFor={id("pickup")} className="col-span-2 sm:col-span-1 lg:col-span-1">
                  <input
                    id={id("pickup")}
                    required
                    list={id("cab-places")}
                    maxLength={MAX_LENGTH.address}
                    autoComplete="off"
                    placeholder="Airport, hotel or address"
                    value={cab.pickupLocation}
                    onChange={(e) => setCab((c) => ({ ...c, pickupLocation: e.target.value }))}
                    className={CONTROL}
                  />
                </Field>
                <Field label="Drop-off" htmlFor={id("dropoff")} className="col-span-2 sm:col-span-1 lg:col-span-1">
                  <input
                    id={id("dropoff")}
                    required
                    list={id("cab-places")}
                    maxLength={MAX_LENGTH.address}
                    autoComplete="off"
                    placeholder="Where you need to get to"
                    value={cab.dropoffLocation}
                    onChange={(e) => setCab((c) => ({ ...c, dropoffLocation: e.target.value }))}
                    className={CONTROL}
                  />
                </Field>
                <Field label="Date" htmlFor={id("date")} className="col-span-2 min-[400px]:col-span-1 lg:col-span-1">
                  <input
                    id={id("date")}
                    type="date"
                    required
                    min={today}
                    value={cab.date}
                    onChange={(e) => setCab((c) => ({ ...c, date: e.target.value }))}
                    className={cn(CONTROL, "nx-figures")}
                  />
                </Field>
                <Field label="Time" htmlFor={id("time")} className="col-span-2 min-[400px]:col-span-1 lg:col-span-1">
                  <input
                    id={id("time")}
                    type="time"
                    required
                    value={cab.time}
                    onChange={(e) => setCab((c) => ({ ...c, time: e.target.value }))}
                    className={cn(CONTROL, "nx-figures")}
                  />
                </Field>
                <Field label="Passengers" htmlFor={id("passengers")} className="col-span-2 lg:col-span-1">
                  <select
                    id={id("passengers")}
                    value={cab.passengers}
                    onChange={(e) => setCab((c) => ({ ...c, passengers: Number(e.target.value) }))}
                    className={cn(CONTROL, "nx-select cursor-pointer")}
                  >
                    {range(1, 12).map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </Field>
                <div className="col-span-2 flex items-end lg:col-span-1">
                  <SubmitButton label="Search Cabs" />
                </div>
              </div>
            </form>
          ) : null}
        </div>
      </div>
    </div>
  );
}
