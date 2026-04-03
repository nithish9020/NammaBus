export type StaffStatus = 'active' | 'inactive' | 'suspended';

export interface Driver {
  id: string;
  userId: string;
  licenseNumber: string;
  phone: string;
  city: string;
  status: StaffStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Conductor {
  id: string;
  userId: string;
  badgeNumber: string;
  phone: string;
  city: string;
  status: StaffStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDriverInput {
  userId: string;
  licenseNumber: string;
  phone: string;
  city: string;
}

export interface UpdateDriverInput {
  licenseNumber?: string;
  phone?: string;
  city?: string;
  status?: StaffStatus;
}

export interface CreateConductorInput {
  userId: string;
  badgeNumber: string;
  phone: string;
  city: string;
}

export interface UpdateConductorInput {
  badgeNumber?: string;
  phone?: string;
  city?: string;
  status?: StaffStatus;
}
