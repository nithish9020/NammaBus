import { stopRepository, routeRepository } from "../repository";
import type {
  Route,
  RouteWithStops,
  CreateRouteInput,
  UpdateRouteInput,
} from "../../src/types/mobility.types";

export const routeService = {
  async createRoute(payload: CreateRouteInput): Promise<RouteWithStops> {
    const { routeNumber, name, origin, destination, city, color, stops } = payload;

    if (!routeNumber || !name || !origin || !destination || !city) {
      throw new Error("Missing required fields: routeNumber, name, origin, destination, city");
    }
    if (!stops || !Array.isArray(stops) || stops.length < 2) {
      throw new Error("A route must have at least 2 stops (origin and destination)");
    }

    // Validate sequences are contiguous: 1, 2, 3...
    const sequences = stops.map((s) => s.sequence).sort((a, b) => a - b);
    for (let i = 0; i < sequences.length; i++) {
      if (sequences[i] !== i + 1) {
        throw new Error(`Stop sequences must be contiguous starting from 1. Got: ${sequences.join(", ")}`);
      }
    }

    // Verify all stop IDs exist
    for (const s of stops) {
      const exists = await stopRepository.findStopById(s.stopId);
      if (!exists) throw new Error(`Stop with ID "${s.stopId}" not found`);
    }

    const result = await routeRepository.createRoute(payload);
    return result as RouteWithStops;
  },

  async listRoutes(): Promise<Route[]> {
    return routeRepository.findAllRoutes() as Promise<Route[]>;
  },

  async getRouteById(id: string): Promise<RouteWithStops | null> {
    return routeRepository.findRouteById(id) as Promise<RouteWithStops | null>;
  },

  async updateRoute(id: string, data: UpdateRouteInput): Promise<Route | null> {
    const existing = await routeRepository.findRouteById(id);
    if (!existing) return null;
    return routeRepository.updateRoute(id, data) as Promise<Route | null>;
  },

  async replaceRouteStops(
    routeId: string,
    stops: { stopId: string; sequence: number }[]
  ): Promise<RouteWithStops | null> {
    const existing = await routeRepository.findRouteById(routeId);
    if (!existing) return null;

    if (!stops || !Array.isArray(stops) || stops.length < 2) {
      throw new Error("A route must have at least 2 stops");
    }

    const sequences = stops.map((s) => s.sequence).sort((a, b) => a - b);
    for (let i = 0; i < sequences.length; i++) {
      if (sequences[i] !== i + 1) {
        throw new Error(`Stop sequences must be contiguous starting from 1. Got: ${sequences.join(", ")}`);
      }
    }

    for (const s of stops) {
      const exists = await stopRepository.findStopById(s.stopId);
      if (!exists) throw new Error(`Stop with ID "${s.stopId}" not found`);
    }

    return routeRepository.replaceRouteStops(routeId, stops) as Promise<RouteWithStops | null>;
  },

  async deleteRoute(id: string) {
    return routeRepository.deleteRoute(id);
  },
};
