import { Request, Response } from "express";
import { busService } from "../service";

export const busController = {
  /** POST /buses */
  async createBus(req: Request, res: Response) {
    try {
      const result = await busService.createBus(req.body);
      res.status(201).json({ bus: result });
    } catch (err: any) {
      res.status(400).json({ error: err?.message || "Failed to create bus" });
    }
  },

  /** GET /buses */
  async listBuses(_req: Request, res: Response) {
    const buses = await busService.listBuses();
    res.json({ buses });
  },

  /** GET /buses/:id */
  async getBus(req: Request, res: Response) {
    const { id } = req.params;
    const result = await busService.getBusById(id);
    if (!result) return res.status(404).json({ error: "Bus not found" });
    res.json({ bus: result });
  },

  /** PATCH /buses/:id */
  async updateBus(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const updated = await busService.updateBus(id, req.body);
      if (!updated) return res.status(404).json({ error: "Bus not found" });
      res.json({ bus: updated });
    } catch (err: any) {
      res.status(400).json({ error: err?.message || "Failed to update bus" });
    }
  },

  /** DELETE /buses/:id */
  async deleteBus(req: Request, res: Response) {
    const { id } = req.params;
    await busService.deleteBus(id);
    res.status(204).send();
  },
};
