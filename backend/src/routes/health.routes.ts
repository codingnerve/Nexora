import { Router } from "express";

import { getDatabaseStatus } from "../config/database";
import { env } from "../config/env";
import { ok } from "../types/api.types";

const router = Router();

/**
 * GET /api/health
 *
 * Reports liveness plus whether the database and email transport are usable, so
 * a deployment check can tell a partially-configured service from a healthy one.
 * Deliberately exposes no version numbers, hostnames or credentials.
 */
router.get("/", (_req, res) => {
  const database = getDatabaseStatus();
  const healthy = database === "connected";

  // Production reveals only whether the service is healthy. Which dependency
  // is failing, and how the service is configured, is for our own logs and
  // for development — not for anyone who can reach a public URL.
  const body = env.isProduction
    ? { status: healthy ? "ok" : "degraded" }
    : {
        status: healthy ? "ok" : "degraded",
        database,
        email: env.canSendEmail ? "configured" : "not configured",
        environment: env.NODE_ENV,
        uptimeSeconds: Math.round(process.uptime()),
      };

  res.status(healthy ? 200 : 503).json(
    ok(
      body,
      healthy ? "Service is healthy." : "Service is degraded."
    )
  );
});

export default router;
