import { env } from "../config/env";
import { logger } from "../utils/logger";

/**
 * Brevo transactional email transport.
 *
 * The only place in the codebase that knows Brevo exists. Everything above it
 * deals in "send this message to this person"; swapping provider means
 * rewriting this file and nothing else.
 *
 * Uses `fetch` directly rather than the Brevo SDK: the transactional endpoint
 * is a single POST, and Node 20+ has `fetch` built in, so the SDK would be a
 * dependency earning nothing.
 */

const BREVO_ENDPOINT = "https://api.brevo.com/v3/smtp/email";

/** Abandoned rather than left hanging — email must never stall a request. */
const SEND_TIMEOUT_MS = 10_000;

export interface EmailRecipient {
  email: string;
  name?: string;
}

export interface SendEmailInput {
  to: EmailRecipient;
  subject: string;
  html: string;
  /** Plain-text alternative. Improves deliverability and serves text clients. */
  text: string;
  /** Where a reply should go, when that differs from the sender. */
  replyTo?: EmailRecipient;
  /** Brevo tag, used for filtering in their dashboard. */
  tag?: string;
}

export class BrevoError extends Error {
  readonly status: number;

  constructor(message: string, status = 0) {
    super(message);
    this.name = "BrevoError";
    this.status = status;
  }
}

/** True when the transport has everything it needs to send. */
export function isBrevoConfigured(): boolean {
  return Boolean(env.BREVO_API_KEY && env.BREVO_SENDER_EMAIL);
}

/**
 * Sends one transactional email.
 *
 * Throws `BrevoError` on failure. Callers are expected to catch and carry on —
 * a failed email must never fail an inquiry.
 */
export async function sendEmail(input: SendEmailInput): Promise<string> {
  if (!isBrevoConfigured()) {
    throw new BrevoError("Brevo is not configured.");
  }

  const body = {
    sender: {
      name: env.BREVO_SENDER_NAME,
      email: env.BREVO_SENDER_EMAIL,
    },
    to: [{ email: input.to.email, ...(input.to.name ? { name: input.to.name } : {}) }],
    subject: input.subject,
    htmlContent: input.html,
    textContent: input.text,
    ...(input.replyTo ? { replyTo: input.replyTo } : {}),
    ...(input.tag ? { tags: [input.tag] } : {}),
  };

  let response: Response;
  try {
    response = await fetch(BREVO_ENDPOINT, {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        // The key is read from the environment and never logged.
        "api-key": env.BREVO_API_KEY as string,
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(SEND_TIMEOUT_MS),
    });
  } catch (error) {
    // Network failure, DNS failure or timeout.
    throw new BrevoError(
      error instanceof Error && error.name === "TimeoutError"
        ? "Brevo request timed out."
        : "Could not reach Brevo."
    );
  }

  if (!response.ok) {
    // Brevo returns { code, message }. Keep the message for our own logs only —
    // it never reaches a customer.
    let detail = `HTTP ${response.status}`;
    try {
      const payload = (await response.json()) as { message?: string; code?: string };
      if (payload?.message) detail = `${payload.code ?? response.status}: ${payload.message}`;
    } catch {
      // Body was not JSON; the status alone is enough.
    }
    throw new BrevoError(`Brevo rejected the message (${detail})`, response.status);
  }

  const result = (await response.json().catch(() => ({}))) as { messageId?: string };
  return result.messageId ?? "sent";
}

/** Startup diagnostic. Logs configuration state without revealing the key. */
export function logBrevoStatus(): void {
  if (!isBrevoConfigured()) {
    logger.warn("Brevo is not configured — no email will be sent.");
    return;
  }
  logger.info(`Brevo configured. Sending as ${env.BREVO_SENDER_EMAIL}`);
}
