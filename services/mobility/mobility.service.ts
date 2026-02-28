import { mobilityRepository, routeRepository, busRepository } from "./mobility.repository";
import type {
  Stop,
  Route,
  RouteWithStops,
  CreateRouteInput,
  UpdateRouteInput,
  Bus,
  CreateBusInput,
  UpdateBusInput,
} from "../src/types/mobility.types";

// ─── Stop Service ──────────────────────────────────────────

export const mobilityService = {
  async createStop(payload: { name: string; lat: string; lon: string; city: string; pincode: string }): Promise<Stop> {
    const { name, lat, lon, city, pincode } = payload;
    if (!name || !lat || !lon || !city || !pincode) {
      throw new Error("Missing required fields for stop");
    }
    const row = await mobilityRepository.createStop(payload);
    return row as Stop;
  },

  async listStops(): Promise<Stop[]> {
    return mobilityRepository.findAllStops() as Promise<Stop[]>;
  },

  async getStopById(id: string): Promise<Stop | null> {
    return mobilityRepository.findStopById(id) as Promise<Stop | null>;
  },

  async updateStop(id: string, data: Partial<{ name: string; lat: string; lon: string; city: string; pincode: string }>) {
    return mobilityRepository.updateStop(id, data) as Promise<Stop | null>;
  },

  async deleteStop(id: string) {
    return mobilityRepository.deleteStop(id);
  },
};

// ─── Route Service ─────────────────────────────────────────

export const routeService = {
  async createRoute(payload: CreateRouteInput): Promise<RouteWithStops> {
    const { routeNumber, name, origin, destination, city, stops } = payload;

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
      const exists = await mobilityRepository.findStopById(s.stopId);
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
      const exists = await mobilityRepository.findStopById(s.stopId);
      if (!exists) throw new Error(`Stop with ID "${s.stopId}" not found`);
    }

    return routeRepository.replaceRouteStops(routeId, stops) as Promise<RouteWithStops | null>;
  },

  async deleteRoute(id: string) {
    return routeRepository.deleteRoute(id);
  },
};

// ─── Bus Service ───────────────────────────────────────────

export const busService = {
  async createBus(payload: CreateBusInput): Promise<Bus> {
    const { registrationNumber, capacity, city } = payload;
    if (!registrationNumber || !capacity || !city) {
      throw new Error("Missing required fields: registrationNumber, capacity, city");
    }
    if (capacity < 1) {
      throw new Error("Capacity must be at least 1");
    }
    const row = await busRepository.createBus(payload);
    return row as Bus;
  },

  async listBuses(): Promise<Bus[]> {
    return busRepository.findAllBuses() as Promise<Bus[]>;
  },

  async getBusById(id: string): Promise<Bus | null> {
    return busRepository.findBusById(id) as Promise<Bus | null>;
  },

  async updateBus(id: string, data: UpdateBusInput): Promise<Bus | null> {
    const existing = await busRepository.findBusById(id);
    if (!existing) return null;
    return busRepository.updateBus(id, data) as Promise<Bus | null>;
  },

  async deleteBus(id: string) {
    return busRepository.deleteBus(id);
  },
};
