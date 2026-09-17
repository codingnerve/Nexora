import { hotelInquirySchema } from "../validators/hotel.validator";
import { compactDetails, createInquiryHandler } from "./inquiryHandler";

/** POST /api/inquiries/hotel */
export const createHotelInquiry = createInquiryHandler({
  type: "HOTEL",
  schema: hotelInquirySchema,
  successMessage: "Hotel inquiry received successfully.",
  toTravelDetails: (v) =>
    compactDetails({
      destination: v.destination,
      checkIn: v.checkIn,
      checkOut: v.checkOut,
      rooms: v.rooms,
      adults: v.adults,
      children: v.children,
      hotelCategory: v.hotelCategory,
      preferredArea: v.preferredArea,
      breakfast: v.breakfast,
    }),
});
