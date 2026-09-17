import { Router } from "express";

import { createHotelInquiry } from "../controllers/hotel.controller";
import { inquiryLimiter } from "../middlewares/rateLimit.middleware";

const router = Router();

/** POST /api/inquiries/hotel */
router.post("/", inquiryLimiter, createHotelInquiry);

export default router;
