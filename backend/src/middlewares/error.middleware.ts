import type { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { ZodError } from "zod";

import { env } from "../config/env";
import { AppError, fail } from "../types/api.types";
import { toFieldErrors } from "../validators/shared.validator";
import { logger } from "../utils/logger";

/** Shown whenever the real reason must not reach the customer. */
const GENERIC_MESSAGE =
  "We couldn't process your request right now. Please try again or call us directly.";

interface BodyParserError extends Error {
  status: number;
  type: string;
}

/**
 * Detects the client errors body-parser throws (`entity.too.large`,
 * `entity.parse.failed`, `charset.unsupported`). These are the caller's fault,
 * so they must surface as 4xx rather than falling through to a 500.
 */
function isBodyParserError(error: unknown): error is BodyParserError {
  if (!(error instanceof Error) || !("status" in error) || !("type" in error)) {
    return false;
  }
  const { status, type } = error as { status: unknown; type: unknown };
  return (
    typeof status === "number" &&
    status >= 400 &&
    status < 500 &&
    typeof type === "string"
  );
}

/** 404 handler for any route that did not match. Registered after all routes. */
export function notFoundHandler(req: Request, res: Response): void {
  res
    .status(404)
    .json(fail("NOT_FOUND", `Route ${req.method} ${req.originalUrl} not found.`));
}

/**
 * Centralised error handler.
 *
 * Express 5 forwards rejected promises from async handlers here automatically,
 * so controllers do not need try/catch for unexpected failures.
 *
 * Nothing in this function ever returns a stack trace, a database message or a
 * configuration value to the client.
 */
export function errorHandler(
  error: unknown,
  req: Request,
  res: Response,
  // Required for Express to recognise this as an error handler (arity of 4).
  _next: NextFunction
): void {
  /* --- Errors we raised deliberately ----------------------------------- */
  if (error instanceof AppError) {
    res
      .status(error.statusCode)
      .json(fail(error.code, error.message, error.details));
    return;
  }

  /* --- Validation ------------------------------------------------------- */
  if (error instanceof ZodError) {
    res
      .status(400)
      .json(
        fail(
          "VALIDATION_ERROR",
          "Please check your submitted details.",
          toFieldErrors(error)
        )
      );
    return;
  }

  if (error instanceof mongoose.Error.ValidationError) {
    const details: Record<string, string> = {};
    for (const [field, issue] of Object.entries(error.errors)) {
      details[field] = issue.message;
    }
    res
      .status(400)
      .json(fail("VALIDATION_ERROR", "Please check your submitted details.", details));
    return;
  }

  if (error instanceof mongoose.Error.CastError) {
    res
      .status(400)
      .json(fail("BAD_REQUEST", "That request contained an invalid value."));
    return;
  }

  /* --- Duplicate key ---------------------------------------------------- */
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: number }).code === 11000
  ) {
    logger.warn("Duplicate key collision");
    res
      .status(409)
      .json(
        fail("CONFLICT", "That request has already been submitted. Please try again.")
      );
    return;
  }

  /* --- Request body problems raised by body-parser ---------------------- */
  if (isBodyParserError(error)) {
    const tooLarge = error.type === "entity.too.large";
    res
      .status(error.status)
      .json(
        fail(
          tooLarge ? "PAYLOAD_TOO_LARGE" : "BAD_REQUEST",
          tooLarge
            ? "That request was too large. Please shorten your message and try again."
            : "The request body could not be read."
        )
      );
    return;
  }

  /* --- Anything else is a bug: log it fully, reveal nothing ------------- */
  logger.error(`Unhandled error on ${req.method} ${req.originalUrl}`, error);

  res.status(500).json(
    fail(
      "INTERNAL_ERROR",
      env.isProduction
        ? GENERIC_MESSAGE
        : // In development, surface the real message to speed up debugging.
          `${GENERIC_MESSAGE} [dev: ${
            error instanceof Error ? error.message : String(error)
          }]`
    )
  );
}
