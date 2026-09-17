import { env } from "../config/env";
import {
  agentSubject,
  renderAgentEmail,
  type AgentTemplateInput,
} from "../templates/agent.template";
import {
  CUSTOMER_SUBJECT,
  renderCustomerEmail,
} from "../templates/customer.template";
import type { Customer, InquiryCreatedPayload } from "../types/inquiry.types";
import { logger } from "../utils/logger";
import { isBrevoConfigured, sendEmail } from "./brevo.service";

/**
 * Email orchestration.
 *
 * Builds the two messages an inquiry produces and hands them to the Brevo
 * transport. Knows about templates and recipients; knows nothing about HTTP.
 *
 * ── The rule that governs this whole file ────────────────────────────────
 *  Email is never a dependency of inquiry creation. The record is already in
 *  MongoDB before anything here runs. If Brevo is down, misconfigured or slow,
 *  the customer still has their reference and the agent can still see the
 *  request in the database. Nothing in here is allowed to throw into a
 *  request/response cycle.
 * ─────────────────────────────────────────────────────────────────────────
 */

export interface AgentEmailPayload {
  inquiry: InquiryCreatedPayload;
  customer: Customer;
  travelDetails: Record<string, unknown>;
  message?: string | undefined;
  submittedAt: Date;
}

export interface CustomerEmailPayload {
  inquiry: InquiryCreatedPayload;
  customer: Customer;
}

/** Whether both a transport and a destination mailbox are configured. */
function canNotifyAgent(): boolean {
  return env.EMAIL_ENABLED && isBrevoConfigured() && Boolean(env.AGENT_EMAIL);
}

function canNotifyCustomer(): boolean {
  return env.EMAIL_ENABLED && isBrevoConfigured();
}

/**
 * Notifies the travel team that a new inquiry has arrived.
 *
 * The agent address comes only from `AGENT_EMAIL` — never from request input,
 * so the API cannot be used to relay mail to an arbitrary recipient.
 */
export async function sendAgentInquiryEmail(
  payload: AgentEmailPayload
): Promise<void> {
  const { inquiryId, type } = payload.inquiry;

  if (!canNotifyAgent()) {
    logger.debug(`Email not configured — skipping agent notification: ${inquiryId}`);
    return;
  }

  const template: AgentTemplateInput = {
    inquiryId,
    type,
    customer: payload.customer,
    travelDetails: payload.travelDetails,
    message: payload.message,
    submittedAt: payload.submittedAt,
  };

  const { html, text } = renderAgentEmail(template);

  await sendEmail({
    to: { email: env.AGENT_EMAIL as string, name: env.BREVO_SENDER_NAME },
    subject: agentSubject(type, inquiryId),
    html,
    text,
    // Replying to the notification reaches the customer directly.
    replyTo: { email: payload.customer.email, name: payload.customer.name },
    tag: `inquiry-${type.toLowerCase()}`,
  });

  logger.info(`Agent email sent: ${inquiryId}`);
}

/**
 * Acknowledges receipt to the customer.
 *
 * Never states that anything is confirmed, booked or issued.
 */
export async function sendCustomerAcknowledgementEmail(
  payload: CustomerEmailPayload
): Promise<void> {
  const { inquiryId, type } = payload.inquiry;

  if (!canNotifyCustomer()) {
    logger.debug(`Email not configured — skipping acknowledgement: ${inquiryId}`);
    return;
  }

  const { html, text } = renderCustomerEmail({
    inquiryId,
    type,
    customerName: payload.customer.name,
    tollFree: env.AGENT_PHONE_NUMBER || undefined,
  });

  await sendEmail({
    to: { email: payload.customer.email, name: payload.customer.name },
    subject: CUSTOMER_SUBJECT,
    html,
    text,
    tag: "inquiry-acknowledgement",
  });

  logger.info(`Customer acknowledgement sent: ${inquiryId}`);
}

/**
 * Fires both notifications without ever rejecting.
 *
 * Controllers call this after the inquiry is stored and do not await it, so a
 * slow or failing provider cannot delay or fail the response. Failures are
 * logged with the reference only — never the recipient's details, the message
 * body or any credential.
 */
export function dispatchInquiryEmails(
  agent: AgentEmailPayload,
  customer: CustomerEmailPayload
): void {
  const { inquiryId } = agent.inquiry;

  void Promise.allSettled([
    sendAgentInquiryEmail(agent),
    sendCustomerAcknowledgementEmail(customer),
  ]).then(([agentResult, customerResult]) => {
    if (agentResult?.status === "rejected") {
      logger.error(
        `Agent email failed: ${inquiryId} — ${describe(agentResult.reason)}`
      );
    }
    if (customerResult?.status === "rejected") {
      logger.error(
        `Customer acknowledgement failed: ${inquiryId} — ${describe(
          customerResult.reason
        )}`
      );
    }
  });
}

/** Extracts a safe, credential-free description of a failure for the log. */
function describe(reason: unknown): string {
  if (reason instanceof Error) return reason.message;
  return "unknown error";
}
