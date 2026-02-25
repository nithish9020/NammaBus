import { Router } from "express";
import { mobilityController } from "./mobility.controller";
import { requireAuth } from "../src/lib/middleware";

const router = Router();

// All mobility routes require authentication (admins/drivers)
router.use(requireAuth);

router.post("/stops", mobilityController.createStop);
router.get("/stops", mobilityController.listStops);
router.get("/stops/:id", mobilityController.getStop);
router.put("/stops/:id", mobilityController.updateStop);
router.delete("/stops/:id", mobilityController.deleteStop);

export default router;
