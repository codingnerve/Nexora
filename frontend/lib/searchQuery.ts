import { CABIN_CLASSES } from "@/lib/constants";
import { MAX_LENGTH } from "@/lib/validation";
import type { CabinClass } from "@/types/inquiry";

/**
 * The /search URL format, shared by the homepage search bar (which writes it)
 * and the /search page (which reads it).
 *
 * A search does not query any inventory — it carries what the visitor typed to
 * the matching request form so they don't have to enter it twice. Everything
 * read back from the URL is validated and clamped to what the forms accept, so
 * a hand-edited URL can only ever produce a valid, pre-filled form.
 */

export type SearchService = "flights" | "hotels" | "cabs";

export interface FlightSearch {
  service: "flights";
  tripType: "ROUND_TRIP" | "ONE_WAY";
  from: string;
  to: string;
  departureDate: string;
  returnDate: string;
  adults: number;
  cabinClass: CabinClass;
}

export interface HotelSearch {
  service: "hotels";
  destination: string;
  checkIn: string;
  checkOut: string;
  rooms: number;
  adults: number;
}

export interface CabSearch {
  service: "cabs";
  pickupLocation: string;
  dropoffLocation: string;
  date: string;
  time: string;
  passengers: number;
}

export type TravelSearch = FlightSearch | HotelSearch | CabSearch;

type Params = Record<string, string | string[] | undefined>;

const one = (params: Params, key: string): string => {
  const value = params[key];
  return (Array.isArray(value) ? value[0] : value) ?? "";
};

const text = (value: string, max: number) => value.trim().slice(0, max);

const isoDate = (value: string) => (/^\d{4}-\d{2}-\d{2}$/.test(value) ? value : "");

const time = (value: string) => (/^([01]\d|2[0-3]):[0-5]\d$/.test(value) ? value : "");

const count = (value: string, min: number, max: number, fallback: number) => {
  const n = Number.parseInt(value, 10);
  return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : fallback;
};

/** Reads a search from URL parameters. Unknown or malformed values fall back to defaults. */
export function parseSearch(params: Params): TravelSearch {
  const type = one(params, "type");

  if (type === "hotels") {
    return {
      service: "hotels",
      destination: text(one(params, "destination"), MAX_LENGTH.place),
      checkIn: isoDate(one(params, "checkIn")),
      checkOut: isoDate(one(params, "checkOut")),
      rooms: count(one(params, "rooms"), 1, 8, 1),
      adults: count(one(params, "adults"), 1, 12, 2),
    };
  }

  if (type === "cabs") {
    return {
      service: "cabs",
      pickupLocation: text(one(params, "pickup"), MAX_LENGTH.address),
      dropoffLocation: text(one(params, "dropoff"), MAX_LENGTH.address),
      date: isoDate(one(params, "date")),
      time: time(one(params, "time")),
      passengers: count(one(params, "passengers"), 1, 12, 2),
    };
  }

  const cabin = one(params, "cabin");
  return {
    service: "flights",
    tripType: one(params, "trip") === "ONE_WAY" ? "ONE_WAY" : "ROUND_TRIP",
    from: text(one(params, "from"), MAX_LENGTH.place),
    to: text(one(params, "to"), MAX_LENGTH.place),
    departureDate: isoDate(one(params, "depart")),
    returnDate: isoDate(one(params, "return")),
    adults: count(one(params, "adults"), 1, 9, 1),
    cabinClass: CABIN_CLASSES.some((c) => c.value === cabin) ? (cabin as CabinClass) : "ECONOMY",
  };
}

/** Writes a search as a /search URL. Empty values are left out. */
export function searchHref(search: TravelSearch): string {
  const entries: [string, string | number][] =
    search.service === "flights"
      ? [
          ["type", "flights"],
          ["trip", search.tripType],
          ["from", search.from],
          ["to", search.to],
          ["depart", search.departureDate],
          ["return", search.tripType === "ROUND_TRIP" ? search.returnDate : ""],
          ["adults", search.adults],
          ["cabin", search.cabinClass],
        ]
      : search.service === "hotels"
        ? [
            ["type", "hotels"],
            ["destination", search.destination],
            ["checkIn", search.checkIn],
            ["checkOut", search.checkOut],
            ["rooms", search.rooms],
            ["adults", search.adults],
          ]
        : [
            ["type", "cabs"],
            ["pickup", search.pickupLocation],
            ["dropoff", search.dropoffLocation],
            ["date", search.date],
            ["time", search.time],
            ["passengers", search.passengers],
          ];

  const query = new URLSearchParams();
  for (const [key, value] of entries) {
    const s = String(value).trim();
    if (s) query.set(key, s);
  }
  return `/search?${query.toString()}`;
}

