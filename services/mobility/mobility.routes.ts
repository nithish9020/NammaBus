import { Router } from "express";
import {
  stopController,
  routeController,
  busController,
  tripController,
  tripLocationController,
} from "./controller";
import { requireAuth } from "../src/lib/middleware";

const router = Router();

// All mobility routes require authentication (admins/drivers)
router.use(requireAuth);

// ─── Stops ─────────────────────────────────────────────────
router.post("/stops", stopController.createStop);
router.get("/stops", stopController.listStops);
router.get("/stops/:id", stopController.getStop);
router.put("/stops/:id", stopController.updateStop);
router.delete("/stops/:id", stopController.deleteStop);

// ─── Routes ────────────────────────────────────────────────
router.post("/routes", routeController.createRoute);
router.get("/routes", routeController.listRoutes);
router.get("/routes/:id", routeController.getRoute);
router.patch("/routes/:id", routeController.updateRoute);
router.put("/routes/:id/stops", routeController.replaceRouteStops);
router.delete("/routes/:id", routeController.deleteRoute);

// ─── Buses ─────────────────────────────────────────────────
router.post("/buses", busController.createBus);
router.get("/buses", busController.listBuses);
router.get("/buses/:id", busController.getBus);
router.patch("/buses/:id", busController.updateBus);
router.delete("/buses/:id", busController.deleteBus);

// ─── Trips ─────────────────────────────────────────────────
router.post("/trips", tripController.createTrip);
router.get("/trips", tripController.listTrips);
router.get("/trips/:id", tripController.getTrip);
router.patch("/trips/:id", tripController.updateTrip);
router.delete("/trips/:id", tripController.deleteTrip);

// ─── Trip Locations (GPS pings) ────────────────────────────
router.post("/trips/:id/locations", tripLocationController.addLocations);
router.get("/trips/:id/locations", tripLocationController.getLocations);
router.get("/trips/:id/locations/latest", tripLocationController.getLatestLocation);

export default router;
