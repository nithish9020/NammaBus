import { busRepository, routeRepository, tripRepository } from "../repository";
import { roomManager } from "../../realtime/roomManager";
import { publisher } from "../../src/lib/redis";
import type { Trip, CreateTripInput, UpdateTripInput } from "../../src/types/mobility.types";

export const tripService = {
  async createTrip(payload: CreateTripInput): Promise<Trip> {
    const { busId, routeId, driverId } = payload;
    if (!busId || !routeId || !driverId) {
      throw new Error("Missing required fields: busId, routeId, driverId");
    }

    // Verify bus exists and is active
    const busExists = await busRepository.findBusById(busId);
    if (!busExists) throw new Error(`Bus with ID "${busId}" not found`);
    if (busExists.status !== "active") throw new Error("Bus is not active");

    // Verify route exists
    const routeExists = await routeRepository.findRouteById(routeId);
    if (!routeExists) throw new Error(`Route with ID "${routeId}" not found`);

    const row = await tripRepository.createTrip(payload);
    return row as Trip;
  },

  async listTrips(status?: string): Promise<Trip[]> {
    if (status) {
      return tripRepository.findTripsByStatus(status) as Promise<Trip[]>;
    }
    return tripRepository.findAllTrips() as Promise<Trip[]>;
  },

  async getTripById(id: string): Promise<Trip | null> {
    return tripRepository.findTripById(id) as Promise<Trip | null>;
  },

  async updateTrip(id: string, data: UpdateTripInput): Promise<Trip | null> {
    const existing = await tripRepository.findTripById(id);
    if (!existing) return null;

    // Auto-set timestamps based on status transitions
    const updateData: any = { ...data };
    if (data.status === "in_progress" && existing.status === "scheduled") {
      updateData.startedAt = new Date();
    }
    if (
      (data.status === "completed" || data.status === "cancelled") &&
      existing.status === "in_progress"
    ) {
      updateData.endedAt = new Date();
    }

    const updated = await tripRepository.updateTrip(id, updateData) as Trip | null;

    // When a trip ends, clean up realtime resources:
    // 1. Broadcast "trip:ended" to all WebSocket subscribers and close the room
    // 2. Delete the cached latest position from Redis
    if (updated && (updated.status === "completed" || updated.status === "cancelled")) {
      roomManager.closeRoom(id);

      publisher.del(`trip:${id}:latest`)
        .catch((err) => console.error("[redis] DEL trip latest failed:", err.message));
    }

    return updated;
  },

  async deleteTrip(id: string) {
    return tripRepository.deleteTrip(id);
  },
};
