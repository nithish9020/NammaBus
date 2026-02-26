import { identityRepository } from "./identity.repository";
import type {
  CreateDriverInput,
  UpdateDriverInput,
  CreateConductorInput,
  UpdateConductorInput,
} from "../src/types/identity.types";

// Service layer — business logic.
// Calls the repository. Adds validation, transformation, error handling.

export const identityService = {
  // ─── Users ───────────────────────────────────────────────
  async getAllUsers() {
    const users = await identityRepository.findAllUsers();
    return users.map(({ id, name, email, emailVerified, image, createdAt }) => ({
      id,
      name,
      email,
      emailVerified,
      image,
      createdAt,
    }));
  },

  async getUserById(id: string) {
    const user = await identityRepository.findUserById(id);
    if (!user) return null;

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      emailVerified: user.emailVerified,
      image: user.image,
      createdAt: user.createdAt,
    };
  },

  async getUserByEmail(email: string) {
    const user = await identityRepository.findUserByEmail(email);
    if (!user) return null;

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      emailVerified: user.emailVerified,
      image: user.image,
      createdAt: user.createdAt,
    };
  },

  // ─── Drivers ─────────────────────────────────────────────
  async createDriver(data: CreateDriverInput) {
    if (!data.userId || !data.licenseNumber || !data.phone || !data.city) {
      throw new Error("Missing required fields: userId, licenseNumber, phone, city");
    }
    return identityRepository.createDriver(data);
  },

  async getAllDrivers() {
    return identityRepository.findAllDrivers();
  },

  async getDriverById(id: string) {
    return identityRepository.findDriverById(id);
  },

  async updateDriver(id: string, data: UpdateDriverInput) {
    return identityRepository.updateDriver(id, data);
  },

  async deleteDriver(id: string) {
    return identityRepository.deleteDriver(id);
  },

  // ─── Conductors ──────────────────────────────────────────
  async createConductor(data: CreateConductorInput) {
    if (!data.userId || !data.badgeNumber || !data.phone || !data.city) {
      throw new Error("Missing required fields: userId, badgeNumber, phone, city");
    }
    return identityRepository.createConductor(data);
  },

  async getAllConductors() {
    return identityRepository.findAllConductors();
  },

  async getConductorById(id: string) {
    return identityRepository.findConductorById(id);
  },

  async updateConductor(id: string, data: UpdateConductorInput) {
    return identityRepository.updateConductor(id, data);
  },

  async deleteConductor(id: string) {
    return identityRepository.deleteConductor(id);
  },
};
