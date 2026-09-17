/**
 * The only place in the frontend that talks to the backend over HTTP.
 *
 * Components never call `fetch` directly and never see a raw error. Every
 * failure is normalised into an `ApiError` carrying a message that is safe to
 * show a customer, plus optional per-field errors for form display.
 */

import {
  API_BASE_URL,
  GENERIC_ERROR_MESSAGE,
  INQUIRY_SOURCE,
  NETWORK_ERROR_MESSAGE,
  TIMEOUT_ERROR_MESSAGE,
} from "@/lib/constants";
import type {
  ApiResponse,
  CabInquiryInput,
  FlightInquiryInput,
  GeneralInquiryInput,
  HotelInquiryInput,
  InquiryCreated,
} from "@/types/inquiry";

/** Abandon a request that has not responded — the UI must never hang. */
const REQUEST_TIMEOUT_MS = 15_000;

export class ApiError extends Error {
  readonly status: number;
  readonly fieldErrors: Record<string, string>;

  constructor(
    message: string,
    status = 0,
    fieldErrors: Record<string, string> = {}
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.fieldErrors = fieldErrors;
  }

  /** True when the backend rejected specific fields rather than failing. */
  get isValidationError(): boolean {
    return Object.keys(this.fieldErrors).length > 0;
  }
}

async function post<TBody extends object, TData>(
  path: string,
  body: TBody
): Promise<TData> {
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...body, source: INQUIRY_SOURCE }),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      cache: "no-store",
    });
  } catch (error) {
    // The request never completed: network down, DNS failure, CORS rejection,
    // or our own abort. These are worth distinguishing for the customer —
    // "try again" is useful advice for a timeout and useless for a 500.
    const timedOut =
      error instanceof DOMException && error.name === "TimeoutError";
    throw new ApiError(timedOut ? TIMEOUT_ERROR_MESSAGE : NETWORK_ERROR_MESSAGE);
  }

  let payload: ApiResponse<TData> | null = null;
  try {
    payload = (await response.json()) as ApiResponse<TData>;
  } catch {
    payload = null;
  }

  if (!response.ok || !payload || payload.success !== true) {
    const failure = payload && payload.success === false ? payload.error : null;
    throw new ApiError(
      failure?.message?.trim() || GENERIC_ERROR_MESSAGE,
      response.status,
      failure?.details ?? {}
    );
  }

  return payload.data;
}

/* ---------------------------------------------------------------------------
 * Inquiry submissions
 * ------------------------------------------------------------------------- */

export const submitFlightInquiry = (input: FlightInquiryInput) =>
  post<FlightInquiryInput, InquiryCreated>("/api/inquiries/flight", input);

export const submitHotelInquiry = (input: HotelInquiryInput) =>
  post<HotelInquiryInput, InquiryCreated>("/api/inquiries/hotel", input);

export const submitCabInquiry = (input: CabInquiryInput) =>
  post<CabInquiryInput, InquiryCreated>("/api/inquiries/cab", input);

export const submitGeneralInquiry = (input: GeneralInquiryInput) =>
  post<GeneralInquiryInput, InquiryCreated>("/api/inquiries/general", input);

/* ---------------------------------------------------------------------------
 * Health
 * ------------------------------------------------------------------------- */

export async function checkApiHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`, {
      signal: AbortSignal.timeout(5_000),
      cache: "no-store",
    });
    return response.ok;
  } catch {
    return false;
  }
}
