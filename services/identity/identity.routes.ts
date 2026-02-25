import { Router } from "express";
import { identityController } from "./identity.controller";

const router = Router();

router.get("/users", identityController.getAllUsers);
router.get("/users/:id", identityController.getUserById);
router.get("/users/email/:email", identityController.getUserByEmail);

export default router;
