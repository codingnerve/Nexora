import { z } from "zod";

import { HOTEL_CATEGORIES } from "../types/inquiry.types";
import {
  countField,
  optionalText,
  shortText,
  travelDate,
  withCustomer,
} from "./shared.validator";

/**
 * Hotel inquiry.
 *
 * Check-out must be strictly after check-in — a zero-night stay is not a
 * request we can act on, unlike a same-day return flight which is valid.
 */
export const hotelInquirySchema = withCustomer({
  destination: shortText("Destination", 120),
  checkIn: travelDate("Check-in date"),
  checkOut: travelDate("Check-out date"),
  rooms: countField("Rooms", 1, 20).default(1),
  adults: countField("Adults", 1, 30).default(1),
  children: countField("Children", 0, 20).default(0),
  hotelCategory: z.enum(HOTEL_CATEGORIES, {
    error: "Choose a hotel preference.",
  }),
  preferredArea: optionalText(160),
  breakfast: z.enum(["ANY", "INCLUDED", "NOT_REQUIRED"]).optional(),
}).refine((value) => value.checkOut > value.checkIn, {
  message: "The check-out date must be after the check-in date.",
  path: ["checkOut"],
});

export type HotelInquiryInput = z.infer<typeof hotelInquirySchema>;
