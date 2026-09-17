import { CAB_PHOTOS, FLIGHT_PHOTOS, HOTEL_PHOTOS, TRIP_PHOTOS, type EditorialPhoto } from "@/lib/images";

/**
 * Homepage content.
 *
 * Copy lives here rather than inside JSX so sections stay presentational and
 * the wording can be reviewed in one place. Nothing here asserts a fact the
 * business cannot back up — no counts, no ratings, no partner claims, no
 * prices and no suggestion of instant booking.
 */

/* ---------------------------------------------------------------------------
 * Services
 * ------------------------------------------------------------------------- */

export interface Service {
  readonly id: "flights" | "hotels" | "cabs";
  readonly label: string;
  readonly description: string;
  readonly linkLabel: string;
  readonly href: string;
  readonly image: EditorialPhoto;
}

export const SERVICES: readonly Service[] = [
  {
    id: "flights",
    label: "Flights",
    description:
      "Routes, dates and travel preferences — we'll help you work through the options.",
    linkLabel: "Explore flights",
    href: "/flights",
    image: FLIGHT_PHOTOS.terminal,
  },
  {
    id: "hotels",
    label: "Hotels",
    description: "Find a stay that fits your destination, dates and preferences.",
    linkLabel: "Explore hotels",
    href: "/hotels",
    image: HOTEL_PHOTOS.warmRoom,
  },
  {
    id: "cabs",
    label: "Cabs",
    description:
      "Arrange practical transportation for airport transfers and local travel.",
    linkLabel: "Explore cabs",
    href: "/cabs",
    image: CAB_PHOTOS.saloon,
  },
] as const;

/* ---------------------------------------------------------------------------
 * Why people use Nexora
 * ------------------------------------------------------------------------- */

export const VALUE_PROPS = [
  {
    title: "Personal assistance",
    description: "Talk to a real travel specialist, not a search results page.",
  },
  {
    title: "One request",
    description: "Flights, hotels and transportation handled in one place.",
  },
  {
    title: "Flexible requirements",
    description: "Tell us what matters to you — timings, budget, location, comfort.",
  },
  {
    title: "Practical guidance",
    description: "Get help with the options before you make your booking decision.",
  },
] as const;

/* ---------------------------------------------------------------------------
 * How it works
 * ------------------------------------------------------------------------- */

export const PROCESS_STEPS = [
  {
    title: "Tell us your plans",
    description: "Share your destination, dates and requirements using the request form.",
  },
  {
    title: "We review your request",
    description: "Our team looks at the details you provided and what would suit them.",
  },
  {
    title: "We discuss the options",
    description: "A travel specialist contacts you by phone or email to talk them through.",
  },
  {
    title: "You decide how to proceed",
    description: "Bookings are completed manually, with your agreement and our assistance.",
  },
] as const;

/* ---------------------------------------------------------------------------
 * Travel by purpose — informational, not products
 * ------------------------------------------------------------------------- */

export const TRIP_PURPOSES: readonly {
  title: string;
  body: string;
  image: EditorialPhoto;
}[] = [
  {
    title: "Weekend Escape",
    body: "Short breaks and quick getaways, where good timings matter more than anything.",
    image: TRIP_PHOTOS.lakeEscape,
  },
  {
    title: "Family Travel",
    body: "Trips that need thoughtful planning — rooms that fit, sensible flight times, space for luggage.",
    image: TRIP_PHOTOS.familyBeach,
  },
  {
    title: "Business Travel",
    body: "Flights, hotels near where you need to be, and practical transportation between them.",
    image: FLIGHT_PHOTOS.lounge,
  },
  {
    title: "International Holidays",
    body: "Multi-part travel planning with personal assistance from the first flight to the last transfer.",
    image: TRIP_PHOTOS.balloons,
  },
];
