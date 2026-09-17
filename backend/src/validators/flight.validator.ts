import { z } from "zod";

import { CABIN_CLASSES, TRIP_TYPES } from "../types/inquiry.types";
import {
  countField,
  optionalText,
  shortText,
  travelDate,
  withCustomer,
} from "./shared.validator";

/**
 * Flight inquiry.
 *
 * `returnDate` is required only for a round trip, and must not fall before the
 * departure date. No maximum trip length is imposed — people take long trips.
 */
export const flightInquirySchema = withCustomer({
  tripType: z.enum(TRIP_TYPES, { error: "Choose a trip type." }),
  from: shortText("Departure city", 120),
  to: shortText("Destination", 120),
  departureDate: travelDate("Departure date"),
  returnDate: travelDate("Return date").optional(),
  adults: countField("Adults", 1, 20).default(1),
  children: countField("Children", 0, 20).default(0),
  infants: countField("Infants", 0, 9).default(0),
  cabinClass: z.enum(CABIN_CLASSES, { error: "Choose a cabin class." }),
  preferredAirline: optionalText(120),
})
  .refine(
    (value) => value.tripType !== "ROUND_TRIP" || Boolean(value.returnDate),
    {
      message: "A return date is required for a round trip.",
      path: ["returnDate"],
    }
  )
  .refine(
    (value) =>
      !value.returnDate || value.returnDate >= value.departureDate,
    {
      message: "The return date cannot be before the departure date.",
      path: ["returnDate"],
    }
  )
  // Skip when adults is itself invalid, so one mistake yields one message.
  .refine((value) => value.adults < 1 || value.infants <= value.adults, {
    message: "There must be at least one adult for each infant.",
    path: ["infants"],
  });

export type FlightInquiryInput = z.infer<typeof flightInquirySchema>;
