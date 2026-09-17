import type { Request, Response } from "express";
import type { ZodType } from "zod";
import { ZodError } from "zod";

import { dispatchInquiryEmails } from "../services/email.service";
import { createInquiry } from "../services/inquiry.service";
import { AppError, ok } from "../types/api.types";
import type { Customer, InquiryType, TravelDetails } from "../types/inquiry.types";
import { toFieldErrors } from "../validators/shared.validator";
import { logger } from "../utils/logger";

/**
 * The shared request handler behind all four inquiry controllers.
 *
 * Each controller supplies only its Zod schema, its inquiry type and a
 * function that picks the travel fields out of the validated body. Everything
 * else — validation, honeypot, persistence, email dispatch and the response —
 * is identical and lives here, which is what keeps the controllers thin.
 */

interface HandlerConfig<TParsed> {
  type: InquiryType;
  schema: ZodType<TParsed>;
  /** Extracts the service-specific fields to store under `travelDetails`. */
  toTravelDetails: (parsed: TParsed) => TravelDetails;
  /** Message shown on success. */
  successMessage: string;
}

/** The shape every inquiry schema produces once validated. */
interface ParsedBase {
  customer: Customer;
  message?: string | undefined;
  source?: "WEBSITE" | "PHONE" | "EMAIL" | "REFERRAL" | undefined;
  companyWebsite?: string | undefined;
}

export function createInquiryHandler<TParsed extends ParsedBase>(
  config: HandlerConfig<TParsed>
) {
  return async function handler(req: Request, res: Response): Promise<void> {
    /* --- Validate ----------------------------------------------------- */
    let parsed: TParsed;
    try {
      parsed = config.schema.parse(req.body) as TParsed;
    } catch (error) {
      if (error instanceof ZodError) {
        throw AppError.validation(
          "Please check your submitted details.",
          toFieldErrors(error)
        );
      }
      throw error;
    }

    /* --- Honeypot ------------------------------------------------------ */
    // A real browser never fills this field; it is hidden and out of the tab
    // order. The response is deliberately generic so a bot learns nothing.
    if (parsed.companyWebsite && parsed.companyWebsite.trim() !== "") {
      logger.warn(`Honeypot triggered on ${req.method} ${req.originalUrl}`);
      throw AppError.badRequest("We couldn't process that request.");
    }

    /* --- Persist ------------------------------------------------------- */
    const travelDetails = config.toTravelDetails(parsed);

    const inquiry = await createInquiry({
      type: config.type,
      customer: parsed.customer,
      travelDetails,
      message: parsed.message,
      source: parsed.source,
    });

    /* --- Notify (never blocks or fails the response) -------------------- */
    dispatchInquiryEmails(
      {
        inquiry,
        customer: parsed.customer,
        travelDetails: travelDetails as Record<string, unknown>,
        message: parsed.message,
        submittedAt: new Date(inquiry.createdAt),
      },
      { inquiry, customer: parsed.customer }
    );

    /* --- Respond -------------------------------------------------------- */
    // Only the fields a client actually needs — no database internals.
    res.status(201).json(
      ok(
        {
          inquiryId: inquiry.inquiryId,
          type: inquiry.type,
          status: inquiry.status,
          createdAt: inquiry.createdAt,
        },
        config.successMessage
      )
    );
  };
}

/** Drops undefined keys so optional fields are absent rather than null. */
export function compactDetails<T extends Record<string, unknown>>(details: T): T {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(details)) {
    if (value !== undefined && value !== "") result[key] = value;
  }
  return result as T;
}
