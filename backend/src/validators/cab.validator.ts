import { z } from "zod";

import { VEHICLE_TYPES } from "../types/inquiry.types";
import {
  clockTime,
  countField,
  shortText,
  travelDate,
  withCustomer,
} from "./shared.validator";

/**
 * Cab / transfer inquiry.
 *
 * Pickup and drop-off allow longer strings than a city name, since people
 * paste full addresses and terminal names.
 */
export const cabInquirySchema = withCustomer({
  pickupLocation: shortText("Pickup location", 200),
  dropoffLocation: shortText("Drop-off location", 200),
  date: travelDate("Pickup date"),
  time: clockTime("Pickup time"),
  vehicleType: z.enum(VEHICLE_TYPES, { error: "Choose a vehicle type." }),
  passengers: countField("Passengers", 1, 30).default(1),
  luggage: countField("Luggage", 0, 30).default(0),
});

export type CabInquiryInput = z.infer<typeof cabInquirySchema>;
