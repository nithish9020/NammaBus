import { request } from './client';
import { IDENTITY_ENDPOINTS } from '../constants/endpoints';
import type {
  Driver, Conductor, AuthUser,
  CreateDriverInput, UpdateDriverInput,
  CreateConductorInput, UpdateConductorInput,
} from '../types';

// ─── Users ──────────────────────────────────────────────────

export async function getAllUsers() {
  return request<{ users: AuthUser[] }>('GET', IDENTITY_ENDPOINTS.USERS);
}

export async function getUserById(id: string) {
  return request<{ user: AuthUser }>('GET', IDENTITY_ENDPOINTS.USER_BY_ID(id));
}

// ─── Drivers ────────────────────────────────────────────────

export async function getAllDrivers() {
  return request<{ drivers: Driver[] }>('GET', IDENTITY_ENDPOINTS.DRIVERS);
}

export async function getDriverById(id: string) {
  return request<{ driver: Driver }>('GET', IDENTITY_ENDPOINTS.DRIVER_BY_ID(id));
}

export async function createDriver(input: CreateDriverInput) {
  return request<{ driver: Driver }>('POST', IDENTITY_ENDPOINTS.DRIVERS, input);
}

export async function updateDriver(id: string, input: UpdateDriverInput) {
  return request<{ driver: Driver }>('PATCH', IDENTITY_ENDPOINTS.DRIVER_BY_ID(id), input);
}

export async function deleteDriver(id: string) {
  return request<void>('DELETE', IDENTITY_ENDPOINTS.DRIVER_BY_ID(id));
}

// ─── Conductors ─────────────────────────────────────────────

export async function getAllConductors() {
  return request<{ conductors: Conductor[] }>('GET', IDENTITY_ENDPOINTS.CONDUCTORS);
}

export async function getConductorById(id: string) {
  return request<{ conductor: Conductor }>('GET', IDENTITY_ENDPOINTS.CONDUCTOR_BY_ID(id));
}

export async function createConductor(input: CreateConductorInput) {
  return request<{ conductor: Conductor }>('POST', IDENTITY_ENDPOINTS.CONDUCTORS, input);
}

export async function updateConductor(id: string, input: UpdateConductorInput) {
  return request<{ conductor: Conductor }>('PATCH', IDENTITY_ENDPOINTS.CONDUCTOR_BY_ID(id), input);
}

export async function deleteConductor(id: string) {
  return request<void>('DELETE', IDENTITY_ENDPOINTS.CONDUCTOR_BY_ID(id));
}
