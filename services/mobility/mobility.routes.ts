import { Router } from "express";
import { mobilityController, routeController } from "./mobility.controller";
import { requireAuth } from "../src/lib/middleware";

const router = Router();

// All mobility routes require authentication (admins/drivers)
router.use(requireAuth);

// ─── Stops ─────────────────────────────────────────────────
router.post("/stops", mobilityController.createStop);
router.get("/stops", mobilityController.listStops);
router.get("/stops/:id", mobilityController.getStop);
router.put("/stops/:id", mobilityController.updateStop);
router.delete("/stops/:id", mobilityController.deleteStop);

// ─── Routes ────────────────────────────────────────────────
router.post("/routes", routeController.createRoute);
router.get("/routes", routeController.listRoutes);
router.get("/routes/:id", routeController.getRoute);
router.patch("/routes/:id", routeController.updateRoute);
router.put("/routes/:id/stops", routeController.replaceRouteStops);
router.delete("/routes/:id", routeController.deleteRoute);

export default router;
