import { Request, Response } from "express";
import { mobilityService } from "./mobility.service";

export const mobilityController = {
  async createStop(req: Request, res: Response) {
    try {
      const payload = req.body;
      const stop = await mobilityService.createStop(payload);
      res.status(201).json(stop);
    } catch (err: any) {
      res.status(400).json({ error: err?.message || "Failed to create stop" });
    }
  },

  async listStops(_req: Request, res: Response) {
    const stops = await mobilityService.listStops();
    res.json(stops);
  },

  async getStop(req: Request, res: Response) {
    const { id } = req.params;
    const stop = await mobilityService.getStopById(id);
    if (!stop) return res.status(404).json({ error: "Not found" });
    res.json(stop);
  },

  async updateStop(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const updated = await mobilityService.updateStop(id, req.body);
      if (!updated) return res.status(404).json({ error: "Not found" });
      res.json(updated);
    } catch (err: any) {
      res.status(400).json({ error: err?.message || "Failed to update" });
    }
  },

  async deleteStop(req: Request, res: Response) {
    const { id } = req.params;
    await mobilityService.deleteStop(id);
    res.status(204).send();
  },
};
