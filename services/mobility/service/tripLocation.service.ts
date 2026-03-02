import { tripRepository, tripLocationRepository } from "../repository";
import { redisPubSub } from "../../realtime/redisPubSub";
import { publisher } from "../../src/lib/redis";
import type { TripLocation } from "../../src/types/mobility.types";

export const tripLocationService = {
  /** Bulk insert GPS pings for a trip */
  async addLocations(
    tripId: string,
    locations: { lat: string; lon: string; speed?: string; heading?: string; recordedAt?: Date }[]
  ): Promise<TripLocation[]> {
    if (!locations || !Array.isArray(locations) || locations.length === 0) {
      throw new Error("At least one location is required");
    }

    // Verify trip exists & get busId for broadcasting
    const trip = await tripRepository.findTripById(tripId);
    if (!trip) throw new Error(`Trip with ID "${tripId}" not found`);

    const saved = await tripLocationRepository.insertLocations(tripId, locations) as TripLocation[];

    // Publish latest GPS position to Redis → WebSocket passengers
    const latest = saved[saved.length - 1];
    if (latest) {
      const locationData = {
        type: "bus:location",
        tripId,
        busId: trip.busId,
        lat: latest.lat,
        lon: latest.lon,
        speed: latest.speed,
        heading: latest.heading,
        recordedAt: latest.recordedAt,
      };

      // 1. Pub/Sub: fire-and-forget to all live WebSocket watchers
      redisPubSub.publish(tripId, locationData)
        .catch((err) => console.error("[redis] publish failed:", err.message));

      // 2. SET: overwrite "trip:<id>:latest" so new subscribers get instant position
      publisher.set(`trip:${tripId}:latest`, JSON.stringify(locationData))
        .catch((err) => console.error("[redis] SET latest failed:", err.message));
    }

    return saved;
  },

  /** Get all locations for a trip */
  async getLocations(tripId: string): Promise<TripLocation[]> {
    return tripLocationRepository.findLocationsByTripId(tripId) as Promise<TripLocation[]>;
  },

  /** Get latest location for a trip */
  async getLatestLocation(tripId: string): Promise<TripLocation | null> {
    return tripLocationRepository.findLatestLocation(tripId) as Promise<TripLocation | null>;
  },
};
