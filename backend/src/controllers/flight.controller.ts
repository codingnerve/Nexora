import { flightInquirySchema } from "../validators/flight.validator";
import { compactDetails, createInquiryHandler } from "./inquiryHandler";

/** POST /api/inquiries/flight */
export const createFlightInquiry = createInquiryHandler({
  type: "FLIGHT",
  schema: flightInquirySchema,
  successMessage: "Flight inquiry received successfully.",
  toTravelDetails: (v) =>
    compactDetails({
      tripType: v.tripType,
      from: v.from,
      to: v.to,
      departureDate: v.departureDate,
      returnDate: v.returnDate,
      adults: v.adults,
      children: v.children,
      infants: v.infants,
      cabinClass: v.cabinClass,
      preferredAirline: v.preferredAirline,
    }),
});
