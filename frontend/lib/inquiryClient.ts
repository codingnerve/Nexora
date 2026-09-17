/**
 * Dispatches an inquiry to the right endpoint.
 *
 * A thin discriminator over `lib/api.ts` — the forms know which service they
 * are, not which URL that maps to. `lib/api.ts` remains the single place any
 * HTTP request is made.
 *
 * The Phase 3 mock has been removed now that the API exists. Keeping a switch
 * that silently short-circuits submission would risk shipping a site whose
 * forms quietly go nowhere.
 */

import {
  ApiError,
  submitCabInquiry,
  submitFlightInquiry,
  submitGeneralInquiry,
  submitHotelInquiry,
} from "@/lib/api";
import { GENERIC_ERROR_MESSAGE } from "@/lib/constants";
import type {
  CabInquiryInput,
  FlightInquiryInput,
  GeneralInquiryInput,
  HotelInquiryInput,
  InquiryCreated,
} from "@/types/inquiry";

export type InquiryService = "flights" | "hotels" | "cabs" | "general";

/** Maps a service to the reference prefix the backend issues. */
export const SERVICE_LABEL: Record<InquiryService, string> = {
  flights: "Flight request",
  hotels: "Hotel request",
  cabs: "Cab request",
  general: "Message",
};

export async function submitInquiry(
  service: "flights",
  input: FlightInquiryInput
): Promise<InquiryCreated>;
export async function submitInquiry(
  service: "hotels",
  input: HotelInquiryInput
): Promise<InquiryCreated>;
export async function submitInquiry(
  service: "cabs",
  input: CabInquiryInput
): Promise<InquiryCreated>;
export async function submitInquiry(
  service: "general",
  input: GeneralInquiryInput
): Promise<InquiryCreated>;
export async function submitInquiry(
  service: InquiryService,
  input:
    | FlightInquiryInput
    | HotelInquiryInput
    | CabInquiryInput
    | GeneralInquiryInput
): Promise<InquiryCreated> {
  try {
    switch (service) {
      case "flights":
        return await submitFlightInquiry(input as FlightInquiryInput);
      case "hotels":
        return await submitHotelInquiry(input as HotelInquiryInput);
      case "cabs":
        return await submitCabInquiry(input as CabInquiryInput);
      case "general":
        return await submitGeneralInquiry(input as GeneralInquiryInput);
    }
  } catch (error) {
    // `lib/api.ts` already normalises failures; anything else becomes a
    // customer-safe error rather than reaching the UI raw.
    if (error instanceof ApiError) throw error;
    throw new ApiError(GENERIC_ERROR_MESSAGE);
  }
}
