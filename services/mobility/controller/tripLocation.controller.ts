import { Request, Response } from "express";
import { tripLocationService } from "../service";

export const tripLocationController = {
  /** POST /trips/:id/locations — bulk insert GPS pings */
  async addLocations(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const locations = await tripLocationService.addLocations(id, req.body.locations);
      res.status(201).json({ locations });
    } catch (err: any) {
      res.status(400).json({ error: err?.message || "Failed to add locations" });
    }
  },

  /** GET /trips/:id/locations — get all GPS pings for a trip */
  async getLocations(req: Request, res: Response) {
    const { id } = req.params;
    const locations = await tripLocationService.getLocations(id);
    res.json({ locations });
  },

  /** GET /trips/:id/locations/latest — get latest position */
  async getLatestLocation(req: Request, res: Response) {
    const { id } = req.params;
    const location = await tripLocationService.getLatestLocation(id);
    if (!location) return res.status(404).json({ error: "No location found for this trip" });
    res.json({ location });
  },
};
