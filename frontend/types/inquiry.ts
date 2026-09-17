/**
 * Shared inquiry types.
 *
 * These mirror the Zod schemas in `backend/src/validators`. If a field changes
 * on one side it must change on the other — the backend is the authority and
 * will reject anything that does not match.
 */

import type {
  CABIN_CLASSES,
  HOTEL_CATEGORIES,
  TRIP_TYPES,
  VEHICLE_TYPES,
} from "@/lib/constants";

/* ---------------------------------------------------------------------------
 * Enums, derived from the shared option lists so they cannot drift
 * ------------------------------------------------------------------------- */

export type TripType = (typeof TRIP_TYPES)[number]["value"];
export type CabinClass = (typeof CABIN_CLASSES)[number]["value"];
export type HotelCategory = (typeof HOTEL_CATEGORIES)[number]["value"];
export type VehicleType = (typeof VEHICLE_TYPES)[number]["value"];

export type InquiryType = "FLIGHT" | "HOTEL" | "CAB" | "GENERAL";

export type InquiryStatus =
  | "NEW"
  | "CONTACTED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";

/* ---------------------------------------------------------------------------
 * Customer — identical on every inquiry type
 * ------------------------------------------------------------------------- */

export interface CustomerInput {
  name: string;
  email: string;
  phone: string;
}

/**
 * Fields every submission carries regardless of service.
 *
 * The customer is nested to match the backend contract exactly
 * (see backend/src/validators/shared.validator.ts).
 */
interface BaseInquiryInput {
  customer: CustomerInput;
  message?: string;
  /** Hidden honeypot. Must always be submitted empty by real users. */
  companyWebsite?: string;
}

/* ---------------------------------------------------------------------------
 * Per-service payloads
 * ------------------------------------------------------------------------- */

export interface FlightInquiryInput extends BaseInquiryInput {
  tripType: TripType;
  from: string;
  to: string;
  departureDate: string;
  /** Required by the backend when `tripType` is ROUND_TRIP. */
  returnDate?: string;
  adults: number;
  children: number;
  infants: number;
  cabinClass: CabinClass;
  /** Collected on the /flights page only. Free text — never a guarantee. */
  preferredAirline?: string;
}

export interface HotelInquiryInput extends BaseInquiryInput {
  destination: string;
  checkIn: string;
  checkOut: string;
  rooms: number;
  adults: number;
  children: number;
  hotelCategory: HotelCategory;
  /** Collected on the /hotels page only. */
  preferredArea?: string;
  breakfast?: "ANY" | "INCLUDED" | "NOT_REQUIRED";
}

export interface CabInquiryInput extends BaseInquiryInput {
  pickupLocation: string;
  dropoffLocation: string;
  date: string;
  time: string;
  vehicleType: VehicleType;
  passengers: number;
  luggage: number;
}

export interface GeneralInquiryInput extends BaseInquiryInput {
  subject?: string;
  /** Which area the enquiry is about. Mirrors the backend contact validator. */
  service?: "FLIGHT" | "HOTEL" | "CAB" | "OTHER";
  message: string;
}

/* ---------------------------------------------------------------------------
 * API envelope
 * ------------------------------------------------------------------------- */

/** Returned by every successful `POST /api/inquiries/*` call. */
export interface InquiryCreated {
  inquiryId: string;
  type: InquiryType;
  status: InquiryStatus;
  createdAt: string;
}

export interface ApiSuccess<T> {
  success: true;
  message: string;
  data: T;
}

export interface ApiFailure {
  success: false;
  error: {
    code: string;
    message: string;
    /** Present on validation failures: one entry per invalid field. */
    details?: Record<string, string>;
  };
}

export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;
