import { Request, Response } from "express";
import { driverService } from "../service";

export const driverController = {
  async createDriver(req: Request, res: Response) {
    try {
      const driver = await driverService.createDriver(req.body);
      res.status(201).json({ driver });
    } catch (err: any) {
      res.status(400).json({ error: err?.message || "Failed to create driver" });
    }
  },

  async getAllDrivers(_req: Request, res: Response) {
    try {
      const drivers = await driverService.getAllDrivers();
      res.json({ drivers });
    } catch (error) {
      console.error("Error fetching drivers:", error);
      res.status(500).json({ error: "Failed to fetch drivers" });
    }
  },

  async getDriverById(req: Request, res: Response) {
    try {
      const driver = await driverService.getDriverById(req.params.id);
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
      const driver = await driverService.updateDriver(req.params.id, req.body);
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
      const driver = await driverService.deleteDriver(req.params.id);
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
};
