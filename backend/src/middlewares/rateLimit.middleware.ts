import rateLimit, { type RateLimitRequestHandler } from "express-rate-limit";

import { env } from "../config/env";
import { fail } from "../types/api.types";
import { logger } from "../utils/logger";

/**
 * Every limiter responds in the standard API envelope and always tells the
 * customer they can phone instead — a rate limit must never be a dead end.
 */
export function buildLimiter({
  windowMs,
  limit,
  message,
  name,
  skip,
  countOnlySuccess = false,
}: {
  windowMs: number;
  limit: number;
  message: string;
  name: string;
  /** Overrides the default skip, so tests can exercise real limiting. */
  skip?: () => boolean;
  /** When true, only successful responses count toward the limit. */
  countOnlySuccess?: boolean;
}): RateLimitRequestHandler {
  return rateLimit({
    windowMs,
    limit,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    skipFailedRequests: countOnlySuccess,
    // Lifting the limit under test keeps the suite deterministic. A test that
    // specifically exercises limiting passes its own `skip`.
    skip: skip ?? (() => env.isTest),
    handler: (req, res) => {
      logger.warn(`Rate limit '${name}' hit by ${req.ip} on ${req.originalUrl}`);
      res.status(429).json(fail("RATE_LIMITED", message));
    },
  });
}

/** Broad ceiling applied to the whole API to absorb scraping and scanning. */
export const apiLimiter = buildLimiter({
  name: "api",
  windowMs: 15 * 60 * 1000,
  limit: 300,
  message:
    "Too many requests from this connection. Please wait a few minutes and try again.",
});

/**
 * Strict limit on inquiry submissions. A genuine customer sends one or two
 * requests; anything beyond this in a 15-minute window is automated.
 */
export const inquiryLimiter = buildLimiter({
  name: "inquiry",
  // Only created inquiries count. A customer correcting validation errors must
  // never be locked out; the broad apiLimiter still caps abusive traffic.
  countOnlySuccess: true,
  windowMs: 15 * 60 * 1000,
  limit: 8,
  message:
    "You've sent several requests already. Our team has them and will be in touch — please call us if it's urgent.",
});
