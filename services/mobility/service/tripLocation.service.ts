import { tripRepository, tripLocationRepository } from "../repository";
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

    // Verify trip exists
    const tripExists = await tripRepository.findTripById(tripId);
    if (!tripExists) throw new Error(`Trip with ID "${tripId}" not found`);

    return tripLocationRepository.insertLocations(tripId, locations) as Promise<TripLocation[]>;
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
