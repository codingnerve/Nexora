/**
 * Nexora Destination — application constants.
 *
 * Everything the UI treats as "company information" is read from environment
 * variables here and nowhere else. No phone number, email or address is
 * hardcoded anywhere in the codebase: if a value is not configured, the UI
 * degrades gracefully instead of inventing one.
 */

/* ---------------------------------------------------------------------------
 * Site
 * ------------------------------------------------------------------------- */

export const SITE = {
  name: "Nexora Destinations",
  /** Used for canonical URLs, Open Graph and the sitemap. */
  url: (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(
    /\/$/,
    ""
  ),
  tagline: "Your Journey, Our Destination.",
  description:
    "Welcome to Nexora Destinations, your travel partner for convenient and reliable travel arrangements. Flights, hotels, car rentals, and customized travel packages in one place.",
  locale: "en",
} as const;

/* ---------------------------------------------------------------------------
 * Contact details — configuration placeholders, never invented values
 * ------------------------------------------------------------------------- */

const readEnv = (value: string | undefined): string => {
  const trimmed = value?.trim() ?? "";
  // Guard against an unreplaced placeholder from .env.example being shipped.
  if (!trimmed || trimmed.startsWith("<") || trimmed.startsWith("your-")) {
    return "";
  }
  return trimmed;
};

export const CONTACT = {
  /** Display form, e.g. "(888) 673-5008". */
  tollFree: readEnv(process.env.NEXT_PUBLIC_TOLL_FREE_NUMBER) || "(888) 673-5008",
  email: readEnv(process.env.NEXT_PUBLIC_CONTACT_EMAIL) || "support@nexoradestinations.com",
  address: readEnv(process.env.NEXT_PUBLIC_COMPANY_ADDRESS),
  hours: readEnv(process.env.NEXT_PUBLIC_SUPPORT_HOURS),
  /** International format with country code, e.g. "+971 50 123 4567". */
  whatsapp: readEnv(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER),
} as const;

/** Strips spaces, dashes and brackets so the value is safe inside `tel:`. */
export const toTelHref = (phone: string): string =>
  `tel:${phone.replace(/[^\d+]/g, "")}`;

export const IS_TOLL_FREE_CONFIGURED = CONTACT.tollFree.length > 0;

/** A wa.me chat link. wa.me wants digits only: no "+", spaces or leading zeros. */
export const toWhatsAppHref = (phone: string, message?: string): string => {
  const digits = phone.replace(/\D/g, "").replace(/^0+/, "");
  return message
    ? `https://wa.me/${digits}?text=${encodeURIComponent(message)}`
    : `https://wa.me/${digits}`;
};

export const IS_WHATSAPP_CONFIGURED = CONTACT.whatsapp.length > 0;

/* ---------------------------------------------------------------------------
 * API
 * ------------------------------------------------------------------------- */

export const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050"
).replace(/\/$/, "");

/* ---------------------------------------------------------------------------
 * Navigation
 * ------------------------------------------------------------------------- */

export type NavLink = { readonly label: string; readonly href: string };

/** The four links shown in the centre of the desktop header. */
export const SERVICE_NAV: readonly NavLink[] = [
  { label: "Flights", href: "/flights" },
  { label: "Hotels", href: "/hotels" },
  { label: "Cabs", href: "/cabs" },
  { label: "Destinations", href: "/destinations" },
] as const;

/** Where every "Plan My Trip" action lands: the travel request panel. */
export const PLAN_TRIP_HREF = "/#plan-your-trip";

export const PRIMARY_NAV: readonly NavLink[] = [
  { label: "Flights", href: "/flights" },
  { label: "Hotels", href: "/hotels" },
  { label: "Cabs", href: "/cabs" },
  { label: "Destinations", href: "/destinations" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

export const FOOTER_NAV = {
  quickLinks: [
    { label: "About Us", href: "/about" },
    { label: "Flight Booking", href: "/flights" },
    { label: "Hotel Booking", href: "/hotels" },
    { label: "Car Rental", href: "/cabs" },
    { label: "Travel Packages", href: "/#plan-your-trip" },
    { label: "Contact Us", href: "/contact" },
  ],
  legal: [
    { label: "Terms & Conditions", href: "/terms-and-conditions" },
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Booking Policy", href: "/booking-policy" },
    { label: "Cancellation & Refund Policy", href: "/cancellation-policy" },
  ],
} as const satisfies Record<string, readonly NavLink[]>;

/* ---------------------------------------------------------------------------
 * Business transparency copy — reused wherever the model must be explicit
 * ------------------------------------------------------------------------- */

export const DISCLOSURE = {
  short: "No payment required. Send your details and our travel team will contact you.",
  process:
    "Nexora Destinations does not process online payments or issue tickets directly through this website.",
  assistance:
    "Nexora Destinations assists customers with bookings through our travel specialists.",
} as const;

/** Shown when the API responded, but with a failure. Never a raw error. */
export const GENERIC_ERROR_MESSAGE =
  "We couldn't send your request right now. Please try again or call us toll-free.";

/** Shown when the request never reached the API at all. */
export const NETWORK_ERROR_MESSAGE =
  "We're having trouble connecting right now. Please try again or call us directly.";

/** Shown when the API accepted the request but did not answer in time. */
export const TIMEOUT_ERROR_MESSAGE =
  "That took longer than expected. Please try again or call us directly.";

/* ---------------------------------------------------------------------------
 * Form option lists — shared by the frontend UI and mirrored by backend Zod
 * ------------------------------------------------------------------------- */

export const TRIP_TYPES = [
  { value: "ROUND_TRIP", label: "Round Trip" },
  { value: "ONE_WAY", label: "One Way" },
  { value: "MULTI_CITY", label: "Multi City" },
] as const;

export const CABIN_CLASSES = [
  { value: "ECONOMY", label: "Economy" },
  { value: "PREMIUM_ECONOMY", label: "Premium Economy" },
  { value: "BUSINESS", label: "Business" },
  { value: "FIRST", label: "First" },
] as const;

export const HOTEL_CATEGORIES = [
  { value: "ANY", label: "No preference" },
  { value: "BUDGET", label: "Budget" },
  { value: "THREE_STAR", label: "3 star" },
  { value: "FOUR_STAR", label: "4 star" },
  { value: "FIVE_STAR", label: "5 star" },
  { value: "RESORT", label: "Resort" },
  { value: "APARTMENT", label: "Serviced apartment" },
] as const;

export const VEHICLE_TYPES = [
  { value: "HATCHBACK", label: "Hatchback" },
  { value: "SEDAN", label: "Sedan" },
  { value: "SUV", label: "SUV" },
  { value: "VAN", label: "Van / Minibus" },
  { value: "LUXURY", label: "Luxury" },
] as const;

/* ---------------------------------------------------------------------------
 * Misc
 * ------------------------------------------------------------------------- */

/** Name of the hidden honeypot field. Must match the backend validator. */
export const HONEYPOT_FIELD = "companyWebsite";

/** Where the inquiry originated, recorded on every submission. */
export const INQUIRY_SOURCE = "WEBSITE";
