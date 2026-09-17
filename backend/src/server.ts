import type { Server } from "node:http";

import { createApp } from "./app";
import { connectDatabase, disconnectDatabase } from "./config/database";
import { env } from "./config/env";
import { logBrevoStatus } from "./services/brevo.service";
import { logger } from "./utils/logger";

let server: Server | undefined;

/** Stops accepting connections, then closes the database. */
async function shutdown(signal: string, exitCode = 0): Promise<void> {
  logger.info(`${signal} received — shutting down`);

  // Force-exit if a connection refuses to drain within 10 seconds.
  const failsafe = setTimeout(() => {
    logger.error("Graceful shutdown timed out — forcing exit");
    process.exit(1);
  }, 10_000);
  failsafe.unref();

  try {
    if (server) {
      await new Promise<void>((resolve, reject) => {
        server!.close((error) => (error ? reject(error) : resolve()));
      });
      logger.info("HTTP server closed");
    }
    await disconnectDatabase();
  } catch (error) {
    logger.error("Error during shutdown", error);
    process.exit(1);
  }

  process.exit(exitCode);
}

async function start(): Promise<void> {
  // Connect first: the server must not accept traffic it cannot serve.
  await connectDatabase();

  logBrevoStatus();

  if (!env.canSendEmail) {
    logger.warn(
      "Email is not fully configured — inquiries will be saved but no email will be sent. " +
        "Set BREVO_API_KEY, BREVO_SENDER_EMAIL and AGENT_EMAIL in backend/.env."
    );
  }

  const app = createApp();

  server = app.listen(env.PORT, () => {
    logger.info(`API listening on http://localhost:${env.PORT} (${env.NODE_ENV})`);
    logger.info(`Allowed origins: ${env.allowedOrigins.join(", ")}`);
  });
}

/* --- Process-level safety nets -------------------------------------------- */

process.on("unhandledRejection", (reason) => {
  logger.error("Unhandled promise rejection", reason);
  void shutdown("unhandledRejection", 1);
});

process.on("uncaughtException", (error) => {
  logger.error("Uncaught exception", error);
  void shutdown("uncaughtException", 1);
});

process.on("SIGTERM", () => void shutdown("SIGTERM"));
process.on("SIGINT", () => void shutdown("SIGINT"));

start().catch((error: unknown) => {
  logger.error("Failed to start server", error);
  process.exit(1);
});
