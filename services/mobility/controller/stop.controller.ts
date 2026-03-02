import { Request, Response } from "express";
import { stopService } from "../service";

export const stopController = {
  async createStop(req: Request, res: Response) {
    try {
      const payload = req.body;
      const stop = await stopService.createStop(payload);
      res.status(201).json(stop);
    } catch (err: any) {
      res.status(400).json({ error: err?.message || "Failed to create stop" });
    }
  },

  async listStops(_req: Request, res: Response) {
    const stops = await stopService.listStops();
    res.json(stops);
  },

  async getStop(req: Request, res: Response) {
    const { id } = req.params;
    const stop = await stopService.getStopById(id);
    if (!stop) return res.status(404).json({ error: "Not found" });
    res.json(stop);
  },

  async updateStop(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const updated = await stopService.updateStop(id, req.body);
      if (!updated) return res.status(404).json({ error: "Not found" });
      res.json(updated);
    } catch (err: any) {
      res.status(400).json({ error: err?.message || "Failed to update" });
    }
  },

  async deleteStop(req: Request, res: Response) {
    const { id } = req.params;
    await stopService.deleteStop(id);
    res.status(204).send();
  },
};
