import { Request, Response } from "express";
import { mobilityService, routeService } from "./mobility.service";

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
