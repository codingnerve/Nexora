import { Router, type Request, type Response } from "express";
import { z } from "zod";

import { env } from "../config/env";
import { apiLimiter } from "../middlewares/rateLimit.middleware";
import {
  searchDuffelOffers,
  getDuffelOfferById,
} from "../services/duffel.service";
import { ok, fail } from "../types/api.types";
import { logger } from "../utils/logger";

const router = Router();

const searchSchema = z.object({
  origin: z.string().trim().min(3).max(4),
  destination: z.string().trim().min(3).max(4),
  departDate: z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/, "departDate must be YYYY-MM-DD"),
  returnDate: z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/, "returnDate must be YYYY-MM-DD").optional(),
  cabin: z.enum(["economy", "premium_economy", "business", "first"]).optional().default("economy"),
  adults: z.coerce.number().int().min(1).max(9).default(1),
  children: z.coerce.number().int().min(0).max(8).default(0),
  infants: z.coerce.number().int().min(0).max(8).default(0),
});

/**
 * POST /api/flights/search
 *
 * Live flight search backed by the Duffel Flight API when DUFFEL_ACCESS_TOKEN
 * is configured.
 */
router.post(
  "/search",
  apiLimiter,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const parsed = searchSchema.safeParse(req.body);
      if (!parsed.success) {
        const details: Record<string, string> = {};
        for (const issue of parsed.error.issues) {
          const key = issue.path.join(".") || "body";
          details[key] = issue.message;
        }
        res.status(400).json(fail("VALIDATION_ERROR", "Invalid search parameters", details));
        return;
      }

      if (!env.isDuffelConfigured) {
        // Return 503 so frontend knows to fall back to mock engine if token is not configured
        res.status(503).json(
          fail("INTERNAL_ERROR", "Duffel API is not configured on this server (DUFFEL_ACCESS_TOKEN is missing).")
        );
        return;
      }

      const offers = await searchDuffelOffers(parsed.data);
      res.status(200).json(ok({ offers, count: offers.length }));
    } catch (err: any) {
      logger.error("Duffel flight search failed:", err);
      res.status(502).json(fail("INTERNAL_ERROR", err?.message || "Failed to search flights"));
    }
  }
);

/**
 * GET /api/flights/offers/:id
 */
router.get(
  "/offers/:id",
  apiLimiter,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const rawId = req.params.id;
      const id = Array.isArray(rawId) ? rawId[0] : rawId;
      if (!id) {
        res.status(400).json(fail("BAD_REQUEST", "Offer ID is required"));
        return;
      }

      if (!env.isDuffelConfigured) {
        res.status(503).json(
          fail("INTERNAL_ERROR", "Duffel API is not configured on this server.")
        );
        return;
      }

      const offer = await getDuffelOfferById(id);
      if (!offer) {
        res.status(404).json(fail("NOT_FOUND", "Flight offer not found"));
        return;
      }

      res.status(200).json(ok(offer));
    } catch (err: any) {
      logger.error(`Failed to fetch Duffel offer:`, err);
      res.status(502).json(fail("INTERNAL_ERROR", err?.message || "Failed to retrieve offer"));
    }
  }
);

export default router;
