import { busRepository } from "../repository";
import type { Bus, CreateBusInput, UpdateBusInput } from "../../src/types/mobility.types";

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
