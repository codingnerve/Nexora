import { Router } from "express";

import { createGeneralInquiry } from "../controllers/contact.controller";
import { inquiryLimiter } from "../middlewares/rateLimit.middleware";

const router = Router();

/** POST /api/inquiries/general */
router.post("/", inquiryLimiter, createGeneralInquiry);

export default router;
