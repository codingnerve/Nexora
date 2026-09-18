import path from "node:path";

import dotenv from "dotenv";
import { z } from "zod";

// Load `.env` from the backend root regardless of the current working directory.
dotenv.config({ path: path.resolve(__dirname, "../../.env"), quiet: true });

/**
 * A variable present but blank in `.env` (e.g. `AGENT_EMAIL=`) is treated as
 * absent, so `.optional()` and `.default()` behave as intended rather than
 * failing an empty string against a format check.
 */
const presentEnv: Record<string, string> = Object.fromEntries(
  Object.entries(process.env).filter(
    (entry): entry is [string, string] =>
      typeof entry[1] === "string" && entry[1].trim() !== ""
  )
);

/**
 * Environment schema.
 *
 * The process refuses to start with an invalid environment rather than failing
 * later at request time. Email credentials are optional so the API can run
 * locally without Brevo configured — see `EMAIL_ENABLED` below.
 */
const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),

  PORT: z.coerce.number().int().positive().default(5000),

  MONGODB_URI: z
    .string({ error: "MONGODB_URI is required" })
    .trim()
    .min(1, "MONGODB_URI is required")
    .refine(
      (value) =>
        value.startsWith("mongodb://") || value.startsWith("mongodb+srv://"),
      "MONGODB_URI must start with mongodb:// or mongodb+srv://"
    ),

  /** Comma-separated list of origins allowed to call this API. */
  CLIENT_URL: z.string().trim().min(1).default("http://localhost:3000"),

  /* --- Brevo transactional email ---------------------------------------- */
  BREVO_API_KEY: z.string().trim().optional(),
  BREVO_SENDER_EMAIL: z.email("BREVO_SENDER_EMAIL must be a valid email").optional(),
  BREVO_SENDER_NAME: z.string().trim().default("Nexora Destination"),

  /* --- Where new inquiries are sent ------------------------------------- */
  AGENT_EMAIL: z.email("AGENT_EMAIL must be a valid email").optional(),
  AGENT_PHONE_NUMBER: z.string().trim().default("(888) 673-5008"),

  /** Set to "false" to skip sending email entirely (useful in tests). */
  EMAIL_ENABLED: z
    .enum(["true", "false"])
    .default("true")
    .transform((value) => value === "true"),

  /* --- Duffel Flight Search API ----------------------------------------- */
  DUFFEL_ACCESS_TOKEN: z.string().trim().optional(),
  DUFFEL_API_URL: z.string().trim().default("https://api.duffel.com"),
  DUFFEL_VERSION: z.string().trim().default("v2"),
});

const parsed = envSchema.safeParse(presentEnv);

if (!parsed.success) {
  const details = parsed.error.issues
    .map((issue) => `  - ${issue.path.join(".") || "(root)"}: ${issue.message}`)
    .join("\n");

  // eslint-disable-next-line no-console
  console.error(
    `\nInvalid environment configuration:\n${details}\n\nCheck backend/.env against backend/.env.example.\n`
  );
  process.exit(1);
}

const raw = parsed.data;

/** Origins permitted by CORS, derived from the comma-separated CLIENT_URL. */
const allowedOrigins = raw.CLIENT_URL.split(",")
  .map((origin) => origin.trim().replace(/\/$/, ""))
  .filter((origin) => origin.length > 0);

/**
 * Email can only be sent when the API key, sender and recipient are all
 * present. Otherwise the API still accepts and stores inquiries — it simply
 * logs a warning instead of silently pretending the email went out.
 */
const canSendEmail = Boolean(
  raw.EMAIL_ENABLED &&
    raw.BREVO_API_KEY &&
    raw.BREVO_SENDER_EMAIL &&
    raw.AGENT_EMAIL
);

export const env = {
  ...raw,
  allowedOrigins,
  canSendEmail,
  isDuffelConfigured: Boolean(raw.DUFFEL_ACCESS_TOKEN),
  isProduction: raw.NODE_ENV === "production",
  isDevelopment: raw.NODE_ENV === "development",
  isTest: raw.NODE_ENV === "test",
} as const;

export type Env = typeof env;
