import { Request, Response } from "express";
import { identityService } from "./identity.service";

// Controller layer — handles HTTP request/response.
// Parses params, calls service, sends JSON response.

export const identityController = {
  // ─── Users ───────────────────────────────────────────────
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

  // ─── Drivers ─────────────────────────────────────────────
  async createDriver(req: Request, res: Response) {
    try {
      const driver = await identityService.createDriver(req.body);
      res.status(201).json({ driver });
    } catch (err: any) {
      res.status(400).json({ error: err?.message || "Failed to create driver" });
    }
  },

  async getAllDrivers(_req: Request, res: Response) {
    try {
      const drivers = await identityService.getAllDrivers();
      res.json({ drivers });
    } catch (error) {
      console.error("Error fetching drivers:", error);
      res.status(500).json({ error: "Failed to fetch drivers" });
    }
  },

  async getDriverById(req: Request, res: Response) {
    try {
      const driver = await identityService.getDriverById(req.params.id);
      if (!driver) {
        res.status(404).json({ error: "Driver not found" });
        return;
      }
      res.json({ driver });
    } catch (error) {
      console.error("Error fetching driver:", error);
      res.status(500).json({ error: "Failed to fetch driver" });
    }
  },

  async updateDriver(req: Request, res: Response) {
    try {
      const driver = await identityService.updateDriver(req.params.id, req.body);
      if (!driver) {
        res.status(404).json({ error: "Driver not found" });
        return;
      }
      res.json({ driver });
    } catch (err: any) {
      res.status(400).json({ error: err?.message || "Failed to update driver" });
    }
  },

  async deleteDriver(req: Request, res: Response) {
    try {
      const driver = await identityService.deleteDriver(req.params.id);
      if (!driver) {
        res.status(404).json({ error: "Driver not found" });
        return;
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting driver:", error);
      res.status(500).json({ error: "Failed to delete driver" });
    }
  },

  // ─── Conductors ──────────────────────────────────────────
  async createConductor(req: Request, res: Response) {
    try {
      const conductor = await identityService.createConductor(req.body);
      res.status(201).json({ conductor });
    } catch (err: any) {
      res.status(400).json({ error: err?.message || "Failed to create conductor" });
    }
  },

  async getAllConductors(_req: Request, res: Response) {
    try {
      const conductors = await identityService.getAllConductors();
      res.json({ conductors });
    } catch (error) {
      console.error("Error fetching conductors:", error);
      res.status(500).json({ error: "Failed to fetch conductors" });
    }
  },

  async getConductorById(req: Request, res: Response) {
    try {
      const conductor = await identityService.getConductorById(req.params.id);
      if (!conductor) {
        res.status(404).json({ error: "Conductor not found" });
        return;
      }
      res.json({ conductor });
    } catch (error) {
      console.error("Error fetching conductor:", error);
      res.status(500).json({ error: "Failed to fetch conductor" });
    }
  },

  async updateConductor(req: Request, res: Response) {
    try {
      const conductor = await identityService.updateConductor(req.params.id, req.body);
      if (!conductor) {
        res.status(404).json({ error: "Conductor not found" });
        return;
      }
      res.json({ conductor });
    } catch (err: any) {
      res.status(400).json({ error: err?.message || "Failed to update conductor" });
    }
  },

  async deleteConductor(req: Request, res: Response) {
    try {
      const conductor = await identityService.deleteConductor(req.params.id);
      if (!conductor) {
        res.status(404).json({ error: "Conductor not found" });
        return;
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting conductor:", error);
      res.status(500).json({ error: "Failed to delete conductor" });
    }
  },
};
