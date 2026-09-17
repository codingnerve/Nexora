import { randomInt } from "node:crypto";

import type { InquiryType } from "../types/inquiry.types";

/** Three-letter service code embedded in the inquiry ID. */
const TYPE_CODE: Record<InquiryType, string> = {
  FLIGHT: "FLT",
  HOTEL: "HOT",
  CAB: "CAB",
  GENERAL: "GEN",
};

/**
 * Crockford-style alphabet: digits and uppercase letters with the ambiguous
 * characters removed (no I, L, O, U, or 0/1) so an ID can be read out over the
 * phone without confusion.
 */
const ALPHABET = "23456789ABCDEFGHJKMNPQRSTVWXYZ";

const RANDOM_LENGTH = 6;

/**
 * Generates a customer-facing inquiry reference, e.g. `NEX-FLT-7A92K1`.
 *
 * Uses `crypto.randomInt` rather than `Math.random` so references cannot be
 * guessed or enumerated. With a 30-character alphabet over 6 positions there
 * are ~729 million combinations per service type; the unique index on
 * `inquiryId` is the final guarantee against a collision.
 */
export function generateInquiryId(type: InquiryType): string {
  let suffix = "";

  for (let index = 0; index < RANDOM_LENGTH; index += 1) {
    suffix += ALPHABET[randomInt(ALPHABET.length)];
  }

  return `NEX-${TYPE_CODE[type]}-${suffix}`;
}

/** Shape check used by validators and any future lookup endpoint. */
export const INQUIRY_ID_PATTERN = new RegExp(
  `^NEX-(?:${Object.values(TYPE_CODE).join("|")})-[${ALPHABET}]{${RANDOM_LENGTH}}$`
);

export function isValidInquiryId(value: string): boolean {
  return INQUIRY_ID_PATTERN.test(value);
}
