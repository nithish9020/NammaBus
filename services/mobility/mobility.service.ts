import { mobilityRepository } from "./mobility.repository";
import type { Stop } from "../src/types/mobility.types";

export const mobilityService = {
  async createStop(payload: { name: string; lat: string; lon: string; city: string; pincode: string }): Promise<Stop> {
    // Basic validation
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
