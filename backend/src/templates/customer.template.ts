import type { InquiryType } from "../types/inquiry.types";
import { BRAND, emailLayout, escapeHtml } from "./layout.template";

/**
 * The acknowledgement the customer receives.
 *
 * Deliberately sparse: it confirms receipt, gives the reference, and says a
 * person will be in touch. It contains none of the travel details back at them
 * and nothing that could be read as a confirmed booking.
 *
 * The wording here is load-bearing for the business model. It must never say
 * "confirmed", "booked", "reserved" or "issued".
 */

export interface CustomerTemplateInput {
  inquiryId: string;
  type: InquiryType;
  customerName: string;
  tollFree?: string | undefined;
}

const SERVICE_NOUN: Record<InquiryType, string> = {
  FLIGHT: "flight request",
  HOTEL: "hotel request",
  CAB: "cab request",
  GENERAL: "message",
};

export const CUSTOMER_SUBJECT =
  "We received your travel request — Nexora Destination";

export function renderCustomerEmail(input: CustomerTemplateInput): {
  html: string;
  text: string;
} {
  const noun = SERVICE_NOUN[input.type];
  const firstName = input.customerName.trim().split(/\s+/)[0] ?? "there";

  const bodyRows = `
    <tr>
      <td style="padding:18px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.7;color:${BRAND.ink};">
        Hello ${escapeHtml(firstName)},
      </td>
    </tr>
    <tr>
      <td style="padding:14px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.7;color:${BRAND.ink};">
        Thank you for contacting Nexora Destination. We&rsquo;ve received your
        ${escapeHtml(noun)} and one of our travel specialists will contact you shortly.
      </td>
    </tr>

    <tr>
      <td style="padding:24px 0 0;">
        <div style="display:inline-block;padding:12px 16px;background-color:${BRAND.canvasAlt};border-left:3px solid ${BRAND.clay};">
          <span style="font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:${BRAND.stone};">Your request ID</span><br>
          <span style="font-family:'Courier New',Courier,monospace;font-size:18px;font-weight:bold;color:${BRAND.ink};">${escapeHtml(
            input.inquiryId
          )}</span>
        </div>
      </td>
    </tr>

    <tr>
      <td style="padding:22px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.7;color:${BRAND.ink};">
        Please quote this reference if you get in touch about your request.
      </td>
    </tr>

    ${
      input.tollFree
        ? `<tr>
             <td style="padding:14px 0 22px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.7;color:${BRAND.ink};">
               If you need immediate assistance, please call our toll-free number below.
             </td>
           </tr>`
        : `<tr><td style="padding:0 0 22px;"></td></tr>`
    }

    <tr>
      <td style="padding:0 0 18px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.7;color:${BRAND.ink};">
        Regards,<br>
        <strong>Nexora Destination</strong>
      </td>
    </tr>`;

  const html = emailLayout({
    preheader: `We've received your request. Reference ${input.inquiryId}.`,
    title: "Your request is on its way.",
    bodyRows,
    footerNote:
      "This is confirmation that we received your request — it is not a booking, and no payment has been taken. A travel specialist will contact you to discuss options.",
    tollFree: input.tollFree,
  });

  const text = [
    `Hello ${firstName},`,
    "",
    `Thank you for contacting Nexora Destination. We've received your ${noun} and one of our travel specialists will contact you shortly.`,
    "",
    `Your request ID: ${input.inquiryId}`,
    "",
    "Please quote this reference if you get in touch about your request.",
    input.tollFree
      ? `\nIf you need immediate assistance, call us toll-free on ${input.tollFree}.`
      : null,
    "",
    "Regards,",
    "Nexora Destination",
    "",
    "This is confirmation that we received your request — it is not a booking, and no payment has been taken.",
  ]
    .filter((line): line is string => line !== null)
    .join("\n");

  return { html, text };
}
