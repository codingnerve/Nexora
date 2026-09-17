import { cabInquirySchema } from "../validators/cab.validator";
import { compactDetails, createInquiryHandler } from "./inquiryHandler";

/** POST /api/inquiries/cab */
export const createCabInquiry = createInquiryHandler({
  type: "CAB",
  schema: cabInquirySchema,
  successMessage: "Cab inquiry received successfully.",
  toTravelDetails: (v) =>
    compactDetails({
      pickupLocation: v.pickupLocation,
      dropoffLocation: v.dropoffLocation,
      date: v.date,
      time: v.time,
      vehicleType: v.vehicleType,
      passengers: v.passengers,
      luggage: v.luggage,
    }),
});
