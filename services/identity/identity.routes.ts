import { Router } from "express";
import { identityController } from "./identity.controller";
import { requireAuth } from "../src/lib/middleware";

const router = Router();

router.use(requireAuth);

// ─── Users ───────────────────────────────────────────────
router.get("/users", identityController.getAllUsers);
router.get("/users/:id", identityController.getUserById);
router.get("/users/email/:email", identityController.getUserByEmail);

// ─── Drivers ─────────────────────────────────────────────
router.post("/drivers", identityController.createDriver);
router.get("/drivers", identityController.getAllDrivers);
router.get("/drivers/:id", identityController.getDriverById);
router.patch("/drivers/:id", identityController.updateDriver);
router.delete("/drivers/:id", identityController.deleteDriver);

// ─── Conductors ──────────────────────────────────────────
router.post("/conductors", identityController.createConductor);
router.get("/conductors", identityController.getAllConductors);
router.get("/conductors/:id", identityController.getConductorById);
router.patch("/conductors/:id", identityController.updateConductor);
router.delete("/conductors/:id", identityController.deleteConductor);

export default router;
