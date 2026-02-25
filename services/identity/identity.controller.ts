import { Request, Response } from "express";
import { identityService } from "./identity.service";

// Controller layer — handles HTTP request/response.
// Parses params, calls service, sends JSON response.

export const identityController = {
  async getAllUsers(_req: Request, res: Response) {
    try {
      const users = await identityService.getAllUsers();
      res.json({ users });
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "Failed to fetch users" });
    }
  },

  async getUserById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = await identityService.getUserById(id);

      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      res.json({ user });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ error: "Failed to fetch user" });
    }
  },

  async getUserByEmail(req: Request, res: Response) {
    try {
      const { email } = req.params;
      const user = await identityService.getUserByEmail(email);

      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      res.json({ user });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ error: "Failed to fetch user" });
    }
  },
};
