import { Router } from "express";
import { identityController } from "./identity.controller";
import { requireAuth } from "../src/lib/middleware";

const router = Router();

router.use(requireAuth);

router.get("/users", identityController.getAllUsers);
router.get("/users/:id", identityController.getUserById);
router.get("/users/email/:email", identityController.getUserByEmail);

export default router;
