import { driverRepository } from "../repository";
import type { CreateDriverInput, UpdateDriverInput } from "../../src/types/identity.types";

export const driverService = {
  async createDriver(data: CreateDriverInput) {
    if (!data.userId || !data.licenseNumber || !data.phone || !data.city) {
      throw new Error("Missing required fields: userId, licenseNumber, phone, city");
    }
    return driverRepository.createDriver(data);
  },

  async getAllDrivers() {
    return driverRepository.findAllDrivers();
  },

  async getDriverById(id: string) {
    return driverRepository.findDriverById(id);
  },

  async updateDriver(id: string, data: UpdateDriverInput) {
    return driverRepository.updateDriver(id, data);
  },

  async deleteDriver(id: string) {
    return driverRepository.deleteDriver(id);
  },
};
