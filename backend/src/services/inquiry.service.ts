import { Inquiry } from "../models/Inquiry";
import { AppError } from "../types/api.types";
import type {
  Customer,
  InquiryCreatedPayload,
  InquirySource,
  InquiryType,
  TravelDetails,
} from "../types/inquiry.types";
import { generateInquiryId } from "../utils/generateInquiryId";
import { logger } from "../utils/logger";

/**
 * Inquiry business logic.
 *
 * Controllers call this; nothing else touches the model. Everything here works
 * without email — sending is a separate concern that runs after the record is
 * safely stored, and its failure must never fail the request.
 */

export interface CreateInquiryInput {
  type: InquiryType;
  customer: Customer;
  travelDetails: TravelDetails;
  message?: string | undefined;
  source?: InquirySource | undefined;
}

/** Duplicate-key error from MongoDB. */
function isDuplicateKeyError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: number }).code === 11000
  );
}

/**
 * How many times to regenerate a reference after a collision.
 *
 * With ~729 million combinations per service type a collision is already
 * vanishingly unlikely; these retries exist so that if one ever happens the
 * customer still gets a successful response instead of an error.
 */
const MAX_ID_ATTEMPTS = 5;

export async function createInquiry(
  input: CreateInquiryInput
): Promise<InquiryCreatedPayload> {
  for (let attempt = 1; attempt <= MAX_ID_ATTEMPTS; attempt += 1) {
    const inquiryId = generateInquiryId(input.type);

    try {
      const created = await Inquiry.create({
        inquiryId,
        type: input.type,
        customer: input.customer,
        travelDetails: input.travelDetails,
        ...(input.message ? { message: input.message } : {}),
        source: input.source ?? "WEBSITE",
        status: "NEW",
      });

      // The reference is safe to log; customer details deliberately are not.
      logger.info(`Inquiry created: ${created.inquiryId}`);

      return {
        inquiryId: created.inquiryId,
        type: created.type as InquiryType,
        status: "NEW",
        createdAt: created.createdAt.toISOString(),
      };
    } catch (error) {
      if (isDuplicateKeyError(error) && attempt < MAX_ID_ATTEMPTS) {
        logger.warn(
          `Inquiry reference collision on ${inquiryId} (attempt ${attempt}) — regenerating`
        );
        continue;
      }

      if (isDuplicateKeyError(error)) {
        throw AppError.conflict(
          "We couldn't file that request just now. Please try again."
        );
      }

      throw error;
    }
  }

  // Unreachable: the loop either returns or throws.
  throw AppError.internal("Could not create the inquiry.");
}

/* ---------------------------------------------------------------------------
 * Read helpers
 *
 * Not exposed by any route in V1. They exist because the agent dashboard in a
 * later phase needs exactly these two queries, and putting them here keeps
 * model access in the service layer where it belongs.
 * ------------------------------------------------------------------------- */

export async function findInquiryByReference(inquiryId: string) {
  return Inquiry.findOne({ inquiryId }).lean();
}

export async function countInquiries(): Promise<number> {
  return Inquiry.countDocuments();
}
