import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

import {
  CABIN_CLASSES,
  HOTEL_CATEGORIES,
  INQUIRY_SOURCES,
  INQUIRY_STATUSES,
  INQUIRY_TYPES,
  TRIP_TYPES,
  VEHICLE_TYPES,
} from "../types/inquiry.types";

/**
 * The Inquiry collection — the only collection in V1.
 *
 * One document per travel request, whatever the service. There is no booking,
 * payment, ticket or reservation model anywhere in this system, by design.
 */

const customerSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 200 },
    phone: { type: String, required: true, trim: true, maxlength: 40 },
  },
  { _id: false }
);

/**
 * Travel details.
 *
 * One structured subdocument holding the union of the three services' fields,
 * all optional. Which fields are present is decided by the Zod schema at the
 * API boundary — it accepts only the fields belonging to the requested
 * service, so a flight inquiry can never arrive carrying hotel fields.
 *
 * The alternative, three separate schemas behind a discriminator, would buy
 * stricter storage-level typing at the cost of a much more awkward model for
 * what is a single small document. `strict` still rejects anything unknown.
 */
const travelDetailsSchema = new Schema(
  {
    // --- Flight ---
    tripType: { type: String, enum: TRIP_TYPES },
    from: { type: String, trim: true, maxlength: 120 },
    to: { type: String, trim: true, maxlength: 120 },
    departureDate: { type: String, trim: true },
    returnDate: { type: String, trim: true },
    infants: { type: Number, min: 0, max: 9 },
    cabinClass: { type: String, enum: CABIN_CLASSES },
    preferredAirline: { type: String, trim: true, maxlength: 120 },

    // --- Hotel ---
    destination: { type: String, trim: true, maxlength: 120 },
    checkIn: { type: String, trim: true },
    checkOut: { type: String, trim: true },
    rooms: { type: Number, min: 1, max: 20 },
    hotelCategory: { type: String, enum: HOTEL_CATEGORIES },
    preferredArea: { type: String, trim: true, maxlength: 160 },
    breakfast: { type: String, enum: ["ANY", "INCLUDED", "NOT_REQUIRED"] },

    // --- Cab ---
    pickupLocation: { type: String, trim: true, maxlength: 200 },
    dropoffLocation: { type: String, trim: true, maxlength: 200 },
    date: { type: String, trim: true },
    time: { type: String, trim: true },
    vehicleType: { type: String, enum: VEHICLE_TYPES },
    passengers: { type: Number, min: 1, max: 30 },
    luggage: { type: Number, min: 0, max: 30 },

    // --- Shared by flight and hotel ---
    adults: { type: Number, min: 0, max: 30 },
    children: { type: Number, min: 0, max: 20 },

    // --- General ---
    subject: { type: String, trim: true, maxlength: 160 },
    service: { type: String, enum: ["FLIGHT", "HOTEL", "CAB", "OTHER"] },
  },
  { _id: false }
);

const inquirySchema = new Schema(
  {
    inquiryId: {
      type: String,
      required: true,
      unique: true,
      immutable: true,
      trim: true,
    },
    type: { type: String, required: true, enum: INQUIRY_TYPES },
    customer: { type: customerSchema, required: true },
    travelDetails: { type: travelDetailsSchema, required: true, default: () => ({}) },
    message: { type: String, trim: true, maxlength: 2000 },
    status: {
      type: String,
      required: true,
      enum: INQUIRY_STATUSES,
      default: "NEW",
    },
    source: {
      type: String,
      required: true,
      enum: INQUIRY_SOURCES,
      default: "WEBSITE",
    },
  },
  {
    timestamps: true,
    // Reject any field not declared above rather than silently storing it.
    strict: true,
    minimize: false,
  }
);

/* ---------------------------------------------------------------------------
 * Indexes
 *
 * `inquiryId` is already unique via the field definition. The rest support the
 * queries a future agent dashboard will need: a work queue ordered by age, and
 * lookups by customer.
 * ------------------------------------------------------------------------- */
inquirySchema.index({ status: 1, createdAt: -1 });
inquirySchema.index({ type: 1, createdAt: -1 });
inquirySchema.index({ "customer.email": 1, createdAt: -1 });
inquirySchema.index({ createdAt: -1 });

export type InquiryDocument = InferSchemaType<typeof inquirySchema>;

/**
 * Reuse an already-compiled model when one exists. Without this, re-importing
 * during a watch reload or a test run throws `OverwriteModelError`.
 */
export const Inquiry: Model<InquiryDocument> =
  (models.Inquiry as Model<InquiryDocument>) ??
  model<InquiryDocument>("Inquiry", inquirySchema);
