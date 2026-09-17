import { Router } from "express";

import { createCabInquiry } from "../controllers/cab.controller";
import { inquiryLimiter } from "../middlewares/rateLimit.middleware";

const router = Router();

/** POST /api/inquiries/cab */
router.post("/", inquiryLimiter, createCabInquiry);

export default router;
