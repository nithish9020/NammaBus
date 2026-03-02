import { Request, Response } from "express";
import { routeService } from "../service";

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
