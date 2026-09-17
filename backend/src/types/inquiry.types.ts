/**
 * Domain types shared across models, services and controllers.
 *
 * The string unions here are the single source of truth: the Mongoose schema
 * enums and the Zod validators both derive from these arrays.
 */

export const INQUIRY_TYPES = ["FLIGHT", "HOTEL", "CAB", "GENERAL"] as const;
export type InquiryType = (typeof INQUIRY_TYPES)[number];

export const INQUIRY_STATUSES = [
  "NEW",
  "CONTACTED",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
] as const;
export type InquiryStatus = (typeof INQUIRY_STATUSES)[number];

export const INQUIRY_SOURCES = ["WEBSITE", "PHONE", "EMAIL", "REFERRAL"] as const;
export type InquirySource = (typeof INQUIRY_SOURCES)[number];

export const TRIP_TYPES = ["ROUND_TRIP", "ONE_WAY", "MULTI_CITY"] as const;
export type TripType = (typeof TRIP_TYPES)[number];

export const CABIN_CLASSES = [
  "ECONOMY",
  "PREMIUM_ECONOMY",
  "BUSINESS",
  "FIRST",
] as const;
export type CabinClass = (typeof CABIN_CLASSES)[number];

export const HOTEL_CATEGORIES = [
  "ANY",
  "BUDGET",
  "THREE_STAR",
  "FOUR_STAR",
  "FIVE_STAR",
  "RESORT",
  "APARTMENT",
] as const;
export type HotelCategory = (typeof HOTEL_CATEGORIES)[number];

export const VEHICLE_TYPES = [
  "HATCHBACK",
  "SEDAN",
  "SUV",
  "VAN",
  "LUXURY",
] as const;
export type VehicleType = (typeof VEHICLE_TYPES)[number];

/* ---------------------------------------------------------------------------
 * Customer
 * ------------------------------------------------------------------------- */

export interface Customer {
  name: string;
  email: string;
  phone: string;
}

/* ---------------------------------------------------------------------------
 * Travel details — a discriminated union keyed by inquiry type
 * ------------------------------------------------------------------------- */

export interface FlightTravelDetails {
  tripType: TripType;
  from: string;
  to: string;
  departureDate: string;
  returnDate?: string;
  adults: number;
  children: number;
  infants: number;
  cabinClass: CabinClass;
  /** Optional, collected on the /flights page. */
  preferredAirline?: string;
}

export interface HotelTravelDetails {
  destination: string;
  checkIn: string;
  checkOut: string;
  rooms: number;
  adults: number;
  children: number;
  hotelCategory: HotelCategory;
  /** Optional, collected on the /hotels page. */
  preferredArea?: string;
  breakfast?: "ANY" | "INCLUDED" | "NOT_REQUIRED";
}

export interface CabTravelDetails {
  pickupLocation: string;
  dropoffLocation: string;
  date: string;
  time: string;
  vehicleType: VehicleType;
  passengers: number;
  luggage: number;
}

export interface GeneralTravelDetails {
  subject?: string;
}

export type TravelDetails =
  | FlightTravelDetails
  | HotelTravelDetails
  | CabTravelDetails
  | GeneralTravelDetails;

/* ---------------------------------------------------------------------------
 * Inquiry
 * ------------------------------------------------------------------------- */

export interface InquiryRecord {
  inquiryId: string;
  type: InquiryType;
  customer: Customer;
  travelDetails: TravelDetails;
  message?: string;
  status: InquiryStatus;
  source: InquirySource;
  createdAt: Date;
  updatedAt: Date;
}

/** What the API returns to the frontend after a successful submission. */
export interface InquiryCreatedPayload {
  inquiryId: string;
  type: InquiryType;
  status: InquiryStatus;
  createdAt: string;
}
