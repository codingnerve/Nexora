import { Router } from "express";

import cabRoutes from "./cab.routes";
import contactRoutes from "./contact.routes";
import flightRoutes from "./flight.routes";
import flightsSearchRoutes from "./flightsSearch.routes";
import healthRoutes from "./health.routes";
import hotelRoutes from "./hotel.routes";

/**
 * API surface.
 *
 *   GET  /api/health
 *   POST /api/flights/search
 *   GET  /api/flights/offers/:id
 *   POST /api/inquiries/flight
 *   POST /api/inquiries/hotel
 *   POST /api/inquiries/cab
 *   POST /api/inquiries/general
 */
const router = Router();

router.use("/health", healthRoutes);
router.use("/flights", flightsSearchRoutes);
router.use("/inquiries/flight", flightRoutes);
router.use("/inquiries/hotel", hotelRoutes);
router.use("/inquiries/cab", cabRoutes);
router.use("/inquiries/general", contactRoutes);

export default router;
