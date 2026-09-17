import { Router } from "express";

import { createFlightInquiry } from "../controllers/flight.controller";
import { inquiryLimiter } from "../middlewares/rateLimit.middleware";

const router = Router();

/** POST /api/inquiries/flight */
router.post("/", inquiryLimiter, createFlightInquiry);

export default router;
