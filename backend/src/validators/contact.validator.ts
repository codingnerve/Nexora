import { z } from "zod";

import { optionalText, withCustomer } from "./shared.validator";

/**
 * General enquiry from the contact form.
 *
 * `message` is the substance of this request, so unlike the service forms it
 * is required here. It is declared inside the shape so it overrides the
 * optional `message` on the base schema.
 *
 * `service` records which area the enquiry is about, when the sender says.
 */
export const contactInquirySchema = withCustomer({
  subject: optionalText(160),
  service: z.enum(["FLIGHT", "HOTEL", "CAB", "OTHER"]).optional(),
  message: z
    .string({ error: "Please tell us how we can help." })
    .trim()
    .min(10, "Please give us a little more detail — at least 10 characters.")
    .max(2000, "Please keep your message under 2000 characters."),
});

export type ContactInquiryInput = z.infer<typeof contactInquirySchema>;
