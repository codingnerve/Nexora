import express, { type Express } from "express";

import { env } from "./config/env";
import { errorHandler, notFoundHandler } from "./middlewares/error.middleware";
import { apiLimiter } from "./middlewares/rateLimit.middleware";
import {
  corsPolicy,
  jsonBodyParser,
  requestLogger,
  sanitizeRequest,
  secureHeaders,
} from "./middlewares/security.middleware";
import routes from "./routes";

/**
 * Builds the Express application.
 *
 * Kept separate from `server.ts` so the app can be imported directly by tests
 * without opening a port or connecting to a database.
 */
export function createApp(): Express {
  const app = express();

  /**
   * Trust exactly one proxy hop in production (the platform load balancer), so
   * `req.ip` is the real client address for rate limiting. `true` would let a
   * caller spoof `X-Forwarded-For` and evade the limiter entirely.
   */
  if (env.isProduction) {
    app.set("trust proxy", 1);
  }

  app.disable("x-powered-by");
  app.disable("etag");

  /* --- Security and parsing (order matters) ----------------------------- */
  app.use(secureHeaders);
  app.use(corsPolicy);
  app.use(requestLogger);
  app.use(jsonBodyParser);
  app.use(sanitizeRequest);
  app.use(apiLimiter);

  /* --- Routes ----------------------------------------------------------- */
  app.use("/api", routes);

  /* --- Fallbacks (must be last) ----------------------------------------- */
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
