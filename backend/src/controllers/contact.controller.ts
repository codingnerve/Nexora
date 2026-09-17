import { contactInquirySchema } from "../validators/contact.validator";
import { compactDetails, createInquiryHandler } from "./inquiryHandler";

/** POST /api/inquiries/general */
export const createGeneralInquiry = createInquiryHandler({
  type: "GENERAL",
  schema: contactInquirySchema,
  successMessage: "Your message has been received.",
  toTravelDetails: (v) =>
    compactDetails({
      subject: v.subject,
      service: v.service,
    }),
});
