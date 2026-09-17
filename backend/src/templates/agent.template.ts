import type { InquiryType } from "../types/inquiry.types";
import {
  BRAND,
  detailLines,
  detailRows,
  emailLayout,
  escapeHtml,
  sectionHeading,
  type DetailRow,
} from "./layout.template";

/**
 * The email the travel team receives when an inquiry arrives.
 *
 * Contains exactly what an agent needs to act on the request and nothing else —
 * no database ids, no internal status fields, no technical metadata.
 */

export interface AgentTemplateInput {
  inquiryId: string;
  type: InquiryType;
  customer: { name: string; email: string; phone: string };
  travelDetails: Record<string, unknown>;
  message?: string | undefined;
  submittedAt: Date;
}

const TYPE_TITLE: Record<InquiryType, string> = {
  FLIGHT: "New Flight Inquiry",
  HOTEL: "New Hotel Inquiry",
  CAB: "New Cab Inquiry",
  GENERAL: "New Travel Inquiry",
};

const TRIP_TYPE_LABEL: Record<string, string> = {
  ROUND_TRIP: "Round trip",
  ONE_WAY: "One way",
  MULTI_CITY: "Multi city",
};

const CABIN_LABEL: Record<string, string> = {
  ECONOMY: "Economy",
  PREMIUM_ECONOMY: "Premium economy",
  BUSINESS: "Business",
  FIRST: "First",
};

const CATEGORY_LABEL: Record<string, string> = {
  ANY: "No preference",
  BUDGET: "Budget",
  THREE_STAR: "3 star",
  FOUR_STAR: "4 star",
  FIVE_STAR: "5 star",
  RESORT: "Resort",
  APARTMENT: "Serviced apartment",
};

const VEHICLE_LABEL: Record<string, string> = {
  HATCHBACK: "Hatchback",
  SEDAN: "Sedan",
  SUV: "SUV",
  VAN: "Van / minibus",
  LUXURY: "Luxury",
};

const BREAKFAST_LABEL: Record<string, string> = {
  ANY: "No preference",
  INCLUDED: "Prefer included",
  NOT_REQUIRED: "Not required",
};

const label = (map: Record<string, string>, value: unknown): string | undefined =>
  typeof value === "string" ? (map[value] ?? value) : undefined;

/** Formats an ISO date for a human reader, e.g. "Fri, 24 Apr 2027". */
function formatDate(value: unknown): string | undefined {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return undefined;
  const date = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

/** Summarises passenger counts as one readable line. */
function travellers(details: Record<string, unknown>): string | undefined {
  const parts: string[] = [];
  const adults = Number(details.adults ?? 0);
  const children = Number(details.children ?? 0);
  const infants = Number(details.infants ?? 0);

  if (adults) parts.push(`${adults} adult${adults === 1 ? "" : "s"}`);
  if (children) parts.push(`${children} child${children === 1 ? "" : "ren"}`);
  if (infants) parts.push(`${infants} infant${infants === 1 ? "" : "s"}`);

  return parts.length ? parts.join(", ") : undefined;
}

/** Builds the service-specific rows. */
function travelRows(
  type: InquiryType,
  d: Record<string, unknown>
): readonly DetailRow[] {
  switch (type) {
    case "FLIGHT":
      return [
        { label: "Trip type", value: label(TRIP_TYPE_LABEL, d.tripType) },
        { label: "From", value: d.from as string },
        { label: "To", value: d.to as string },
        { label: "Departure", value: formatDate(d.departureDate) },
        { label: "Return", value: formatDate(d.returnDate) },
        { label: "Travellers", value: travellers(d) },
        { label: "Cabin", value: label(CABIN_LABEL, d.cabinClass) },
        { label: "Preferred airline", value: d.preferredAirline as string },
      ];
    case "HOTEL":
      return [
        { label: "Destination", value: d.destination as string },
        { label: "Check-in", value: formatDate(d.checkIn) },
        { label: "Check-out", value: formatDate(d.checkOut) },
        { label: "Rooms", value: d.rooms as number },
        { label: "Guests", value: travellers(d) },
        { label: "Hotel category", value: label(CATEGORY_LABEL, d.hotelCategory) },
        { label: "Preferred area", value: d.preferredArea as string },
        { label: "Breakfast", value: label(BREAKFAST_LABEL, d.breakfast) },
      ];
    case "CAB":
      return [
        { label: "Pickup", value: d.pickupLocation as string },
        { label: "Drop-off", value: d.dropoffLocation as string },
        { label: "Date", value: formatDate(d.date) },
        { label: "Time", value: d.time as string },
        { label: "Vehicle type", value: label(VEHICLE_LABEL, d.vehicleType) },
        { label: "Passengers", value: d.passengers as number },
        { label: "Luggage", value: d.luggage as number },
      ];
    case "GENERAL":
      return [
        { label: "Subject", value: d.subject as string },
        { label: "Service", value: d.service as string },
      ];
  }
}

export function agentSubject(type: InquiryType, inquiryId: string): string {
  const noun =
    type === "FLIGHT"
      ? "Flight"
      : type === "HOTEL"
        ? "Hotel"
        : type === "CAB"
          ? "Cab"
          : "Travel";
  return `New ${noun} Inquiry — ${inquiryId}`;
}

export function renderAgentEmail(input: AgentTemplateInput): {
  html: string;
  text: string;
} {
  const customerRows: DetailRow[] = [
    { label: "Name", value: input.customer.name },
    { label: "Email", value: input.customer.email },
    { label: "Phone", value: input.customer.phone },
  ];

  const detailsRows = travelRows(input.type, input.travelDetails);

  const submitted = new Intl.DateTimeFormat("en-GB", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "UTC",
  }).format(input.submittedAt);

  const bodyRows = `
    <tr>
      <td style="padding:14px 0 0;">
        <div style="display:inline-block;padding:8px 12px;background-color:${BRAND.canvasAlt};border-left:3px solid ${BRAND.clay};">
          <span style="font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:${BRAND.stone};">Inquiry ID</span><br>
          <span style="font-family:'Courier New',Courier,monospace;font-size:16px;font-weight:bold;color:${BRAND.ink};">${escapeHtml(
            input.inquiryId
          )}</span>
        </div>
      </td>
    </tr>

    ${sectionHeading("Customer")}
    <tr><td><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${detailRows(
      customerRows
    )}</table></td></tr>

    ${detailsRows.some((r) => r.value) ? sectionHeading("Travel details") : ""}
    <tr><td><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${detailRows(
      detailsRows
    )}</table></td></tr>

    ${
      input.message
        ? `${sectionHeading("Additional requirements")}
           <tr>
             <td style="padding:6px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.7;color:${BRAND.ink};white-space:pre-wrap;">${escapeHtml(
               input.message
             )}</td>
           </tr>`
        : ""
    }

    ${sectionHeading("Submitted")}
    <tr>
      <td style="padding:6px 0 18px;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:${BRAND.ink};">${escapeHtml(
        submitted
      )} UTC</td>
    </tr>`;

  const html = emailLayout({
    preheader: `${TYPE_TITLE[input.type]} from ${input.customer.name} — ${input.inquiryId}`,
    title: TYPE_TITLE[input.type],
    bodyRows,
    footerNote:
      "This is an inquiry, not a booking. Nothing has been reserved, issued or paid for. Contact the customer to discuss options.",
  });

  const text = [
    TYPE_TITLE[input.type],
    "",
    `Inquiry ID: ${input.inquiryId}`,
    "",
    "CUSTOMER",
    detailLines(customerRows),
    "",
    "TRAVEL DETAILS",
    detailLines(detailsRows),
    input.message ? `\nADDITIONAL REQUIREMENTS\n${input.message}` : null,
    "",
    `Submitted: ${submitted} UTC`,
    "",
    "This is an inquiry, not a booking. Nothing has been reserved, issued or paid for.",
  ]
    .filter((line): line is string => line !== null)
    .join("\n");

  return { html, text };
}
