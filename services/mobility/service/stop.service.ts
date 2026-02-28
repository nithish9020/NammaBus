import { stopRepository } from "../repository";
import type { Stop } from "../../src/types/mobility.types";

export const stopService = {
  async createStop(payload: { name: string; lat: string; lon: string; city: string; pincode: string }): Promise<Stop> {
    const { name, lat, lon, city, pincode } = payload;
    if (!name || !lat || !lon || !city || !pincode) {
      throw new Error("Missing required fields for stop");
    }
    const row = await stopRepository.createStop(payload);
    return row as Stop;
  },

  async listStops(): Promise<Stop[]> {
    return stopRepository.findAllStops() as Promise<Stop[]>;
  },

  async getStopById(id: string): Promise<Stop | null> {
    return stopRepository.findStopById(id) as Promise<Stop | null>;
  },

  async updateStop(id: string, data: Partial<{ name: string; lat: string; lon: string; city: string; pincode: string }>) {
    return stopRepository.updateStop(id, data) as Promise<Stop | null>;
  },

  async deleteStop(id: string) {
    return stopRepository.deleteStop(id);
  },
};
