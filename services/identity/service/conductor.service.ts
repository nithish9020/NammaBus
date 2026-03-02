import { conductorRepository } from "../repository";
import type { CreateConductorInput, UpdateConductorInput } from "../../src/types/identity.types";

export const conductorService = {
  async createConductor(data: CreateConductorInput) {
    if (!data.userId || !data.badgeNumber || !data.phone || !data.city) {
      throw new Error("Missing required fields: userId, badgeNumber, phone, city");
    }
    return conductorRepository.createConductor(data);
  },

  async getAllConductors() {
    return conductorRepository.findAllConductors();
  },

  async getConductorById(id: string) {
    return conductorRepository.findConductorById(id);
  },

  async updateConductor(id: string, data: UpdateConductorInput) {
    return conductorRepository.updateConductor(id, data);
  },

  async deleteConductor(id: string) {
    return conductorRepository.deleteConductor(id);
  },
};
