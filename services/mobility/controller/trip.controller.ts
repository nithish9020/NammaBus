import { Request, Response } from "express";
import { tripService } from "../service";

export const tripController = {
  /** POST /trips */
  async createTrip(req: Request, res: Response) {
    try {
      const result = await tripService.createTrip(req.body);
      res.status(201).json({ trip: result });
    } catch (err: any) {
      res.status(400).json({ error: err?.message || "Failed to create trip" });
    }
  },

  /** GET /trips?status=in_progress */
  async listTrips(req: Request, res: Response) {
    const status = req.query.status as string | undefined;
    const trips = await tripService.listTrips(status);
    res.json({ trips });
  },

  /** GET /trips/:id */
  async getTrip(req: Request, res: Response) {
    const { id } = req.params;
    const result = await tripService.getTripById(id);
    if (!result) return res.status(404).json({ error: "Trip not found" });
    res.json({ trip: result });
  },

  /** PATCH /trips/:id */
  async updateTrip(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const updated = await tripService.updateTrip(id, req.body);
      if (!updated) return res.status(404).json({ error: "Trip not found" });
      res.json({ trip: updated });
    } catch (err: any) {
      res.status(400).json({ error: err?.message || "Failed to update trip" });
    }
  },

  /** DELETE /trips/:id */
  async deleteTrip(req: Request, res: Response) {
    const { id } = req.params;
    await tripService.deleteTrip(id);
    res.status(204).send();
  },
};
