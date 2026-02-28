import { Request, Response } from "express";
import { mobilityService, routeService, busService } from "./mobility.service";

// ─── Stop Controllers ──────────────────────────────────────

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

// ─── Route Controllers ─────────────────────────────────────

export const routeController = {
  /** POST /routes — create a route with stops */
  async createRoute(req: Request, res: Response) {
    try {
      const result = await routeService.createRoute(req.body);
      res.status(201).json({ route: result });
    } catch (err: any) {
      res.status(400).json({ error: err?.message || "Failed to create route" });
    }
  },

  /** GET /routes — list all routes (metadata, no stops) */
  async listRoutes(_req: Request, res: Response) {
    const routes = await routeService.listRoutes();
    res.json({ routes });
  },

  /** GET /routes/:id — get route with all stops */
  async getRoute(req: Request, res: Response) {
    const { id } = req.params;
    const result = await routeService.getRouteById(id);
    if (!result) return res.status(404).json({ error: "Route not found" });
    res.json({ route: result });
  },

  /** PATCH /routes/:id — update route metadata */
  async updateRoute(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const updated = await routeService.updateRoute(id, req.body);
      if (!updated) return res.status(404).json({ error: "Route not found" });
      res.json({ route: updated });
    } catch (err: any) {
      res.status(400).json({ error: err?.message || "Failed to update route" });
    }
  },

  /** PUT /routes/:id/stops — replace all stops in a route */
  async replaceRouteStops(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const result = await routeService.replaceRouteStops(id, req.body.stops);
      if (!result) return res.status(404).json({ error: "Route not found" });
      res.json({ route: result });
    } catch (err: any) {
      res.status(400).json({ error: err?.message || "Failed to update route stops" });
    }
  },

  /** DELETE /routes/:id */
  async deleteRoute(req: Request, res: Response) {
    const { id } = req.params;
    await routeService.deleteRoute(id);
    res.status(204).send();
  },
};

// ─── Bus Controllers ───────────────────────────────────────

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
