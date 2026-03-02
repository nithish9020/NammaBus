import { Request, Response } from "express";
import { conductorService } from "../service";

export const conductorController = {
  async createConductor(req: Request, res: Response) {
    try {
      const conductor = await conductorService.createConductor(req.body);
      res.status(201).json({ conductor });
    } catch (err: any) {
      res.status(400).json({ error: err?.message || "Failed to create conductor" });
    }
  },

  async getAllConductors(_req: Request, res: Response) {
    try {
      const conductors = await conductorService.getAllConductors();
      res.json({ conductors });
    } catch (error) {
      console.error("Error fetching conductors:", error);
      res.status(500).json({ error: "Failed to fetch conductors" });
    }
  },

  async getConductorById(req: Request, res: Response) {
    try {
      const conductor = await conductorService.getConductorById(req.params.id);
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
      const conductor = await conductorService.updateConductor(req.params.id, req.body);
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
      const conductor = await conductorService.deleteConductor(req.params.id);
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
