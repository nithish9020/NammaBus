import { Router } from "express";
import { userController, driverController, conductorController } from "./controller";
import { requireAuth } from "../src/lib/middleware";

const router = Router();

router.use(requireAuth);

// ─── Users ───────────────────────────────────────────────
router.get("/users", userController.getAllUsers);
router.get("/users/:id", userController.getUserById);
router.get("/users/email/:email", userController.getUserByEmail);

// ─── Drivers ─────────────────────────────────────────────
router.post("/drivers", driverController.createDriver);
router.get("/drivers", driverController.getAllDrivers);
router.get("/drivers/:id", driverController.getDriverById);
router.patch("/drivers/:id", driverController.updateDriver);
router.delete("/drivers/:id", driverController.deleteDriver);

// ─── Conductors ──────────────────────────────────────────
router.post("/conductors", conductorController.createConductor);
router.get("/conductors", conductorController.getAllConductors);
router.get("/conductors/:id", conductorController.getConductorById);
router.patch("/conductors/:id", conductorController.updateConductor);
router.delete("/conductors/:id", conductorController.deleteConductor);

export default router;
