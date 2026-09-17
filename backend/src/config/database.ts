import mongoose from "mongoose";

import { env } from "./env";
import { logger } from "../utils/logger";

/**
 * Connects to MongoDB. Called once during startup — the server does not begin
 * listening until this resolves, so no request can arrive before the database
 * is reachable.
 */
export async function connectDatabase(): Promise<void> {
  // Reject documents containing fields absent from the schema.
  mongoose.set("strictQuery", true);

  // If the connection drops, fail a query after 5s instead of queueing it for
  // the 10s default. The customer then sees a clear "try again or call us"
  // message well inside the frontend's 15s request timeout.
  mongoose.set("bufferTimeoutMS", 5_000);

  mongoose.connection.on("error", (error: unknown) => {
    logger.error("MongoDB connection error", error);
  });

  mongoose.connection.on("disconnected", () => {
    logger.warn("MongoDB disconnected");
  });

  mongoose.connection.on("reconnected", () => {
    logger.info("MongoDB reconnected");
  });

  await mongoose.connect(env.MONGODB_URI, {
    // Fail fast on startup rather than queueing requests indefinitely.
    serverSelectionTimeoutMS: 10_000,
    socketTimeoutMS: 45_000,
    maxPoolSize: 10,
  });

  logger.info(`MongoDB connected: ${mongoose.connection.name}`);
}

/** Closes the connection cleanly during shutdown. */
export async function disconnectDatabase(): Promise<void> {
  await mongoose.connection.close(false);
  logger.info("MongoDB connection closed");
}

/** Mongoose readyState mapped to a readable label for the health endpoint. */
export function getDatabaseStatus(): string {
  const states: Record<number, string> = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting",
  };
  return states[mongoose.connection.readyState] ?? "unknown";
}
