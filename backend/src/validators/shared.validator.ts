import { z } from "zod";

/**
 * Validation pieces shared by all four inquiry schemas.
 *
 * Backend validation is authoritative — the frontend's checks exist to save a
 * round trip, nothing more. Every limit here also protects the database from
 * oversized input.
 */

/* ---------------------------------------------------------------------------
 * Primitives
 * ------------------------------------------------------------------------- */

export const shortText = (label: string, max = 120, min = 2) =>
  z
    .string({ error: `${label} is required.` })
    .trim()
    // An empty value reads as "required", not as a length problem.
    .min(1, `${label} is required.`)
    .min(min, `${label} must be at least ${min} characters.`)
    .max(max, `${label} must be ${max} characters or fewer.`);

export const optionalText = (max: number) =>
  z.string().trim().max(max, `Please keep this under ${max} characters.`).optional();

/** An ISO calendar date (`YYYY-MM-DD`) that is also a real date. */
export const isoDate = (label: string) =>
  z
    .string({ error: `${label} is required.` })
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/, `${label} must be a date in YYYY-MM-DD format.`)
    .refine((value) => {
      const parsed = new Date(`${value}T00:00:00Z`);
      // Round-trips only for real calendar dates, so 2026-02-31 is rejected.
      return (
        !Number.isNaN(parsed.getTime()) &&
        parsed.toISOString().slice(0, 10) === value
      );
    }, `${label} is not a valid date.`);

/**
 * A real calendar date that is not in the past.
 *
 * "Today" is taken a day wide: a visitor several timezones ahead of the server
 * can legitimately be on tomorrow's date, and one behind on yesterday's.
 * Anything earlier than that is a mistake, not a travel plan.
 */
export const travelDate = (label: string) =>
  isoDate(label).refine((value) => {
    const yesterday = new Date();
    yesterday.setUTCDate(yesterday.getUTCDate() - 1);
    return value >= yesterday.toISOString().slice(0, 10);
  }, `${label} can't be in the past.`);

/** A 24-hour clock time (`HH:MM`). */
export const clockTime = (label: string) =>
  z
    .string({ error: `${label} is required.` })
    .trim()
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/, `${label} must be a time in HH:MM format.`);

export const countField = (label: string, min: number, max: number) =>
  z.coerce
    .number({ error: `${label} must be a number.` })
    .int(`${label} must be a whole number.`)
    .min(min, `${label} must be at least ${min}.`)
    .max(max, `${label} can be at most ${max}.`);

/* ---------------------------------------------------------------------------
 * Customer
 * ------------------------------------------------------------------------- */

export const customerSchema = z.object({
  name: shortText("Full name", 120),
  email: z
    .email("Enter a valid email address, for example name@example.com")
    .max(200, "That email address is too long.")
    .transform((value) => value.trim().toLowerCase()),
  phone: z
    .string({ error: "Phone number is required." })
    .trim()
    .min(6, "That phone number looks too short.")
    .max(40, "That phone number looks too long.")
    .refine((value) => {
      const digits = value.replace(/\D/g, "");
      return digits.length >= 6 && digits.length <= 15;
    }, "That phone number does not look valid. Include your country code."),
});

export type CustomerInput = z.infer<typeof customerSchema>;

/**
 * Fields every inquiry carries, whatever the service.
 *
 * `companyWebsite` is the honeypot. It is declared here so the schema accepts
 * it; the controller rejects any request where it is filled.
 */
export const baseInquirySchema = z.object({
  message: optionalText(2000),
  source: z.enum(["WEBSITE", "PHONE", "EMAIL", "REFERRAL"]).default("WEBSITE"),
  companyWebsite: z.string().max(200).optional(),
});

/**
 * Accepts the customer either nested (`customer: { name, email, phone }`) or
 * flat (`name`, `email`, `phone`) and normalises to nested.
 *
 * The frontend sends the nested shape. Flat fields are still accepted so a
 * simple integration (curl, a CRM webhook) does not have to nest.
 */
export const withCustomer = <T extends z.ZodRawShape>(shape: T) =>
  z.preprocess(
    (raw) => {
      if (typeof raw !== "object" || raw === null) return raw;
      const input = raw as Record<string, unknown>;
      if (input.customer !== undefined) return input;

      const { name, email, phone, ...rest } = input;
      if (name === undefined && email === undefined && phone === undefined) {
        return input;
      }
      return { ...rest, customer: { name, email, phone } };
    },
    baseInquirySchema.extend(shape).extend({ customer: customerSchema })
  );

/** Turns a ZodError into the `{ field: message }` map the API returns. */
export function toFieldErrors(error: z.ZodError): Record<string, string> {
  const details: Record<string, string> = {};

  for (const issue of error.issues) {
    // `customer.email` reads better to a form than `customer,email`.
    const path = issue.path.join(".") || "_";
    // A root-level failure means the body was not an object at all; say that
    // plainly rather than echoing the parser's internal wording.
    const message = path === "_" ? "The request body must be a JSON object." : issue.message;
    if (!details[path]) details[path] = message;
  }

  return details;
}
