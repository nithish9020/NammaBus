/**
 * Shared identity types for drivers and conductors.
 * Reusable across backend and frontend.
 */

export type StaffStatus = "active" | "inactive" | "suspended";

export interface Driver {
  id: string;
  userId: string;
  licenseNumber: string;
  phone: string;
  city: string;
  status: StaffStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface Conductor {
  id: string;
  userId: string;
  badgeNumber: string;
  phone: string;
  city: string;
  status: StaffStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateDriverInput {
  userId: string;
  licenseNumber: string;
  phone: string;
  city: string;
}

export interface CreateConductorInput {
  userId: string;
  badgeNumber: string;
  phone: string;
  city: string;
}

export interface UpdateDriverInput {
  licenseNumber?: string;
  phone?: string;
  city?: string;
  status?: StaffStatus;
}

export interface UpdateConductorInput {
  badgeNumber?: string;
  phone?: string;
  city?: string;
  status?: StaffStatus;
}
