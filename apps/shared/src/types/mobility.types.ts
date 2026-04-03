// ─── Stops ──────────────────────────────────────────────────

export interface Stop {
  id: string;
  name: string;
  lat: string;
  lon: string;
  city: string;
  pincode: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStopInput {
  name: string;
  lat: string;
  lon: string;
  city: string;
  pincode: string;
}

// ─── Routes ─────────────────────────────────────────────────

export type RouteStatus = 'active' | 'inactive' | 'suspended';

export interface RouteStop {
  id: string;
  routeId: string;
  stopId: string;
  sequence: number;
  createdAt: string;
  stop: Stop;
}

export interface Route {
  id: string;
  routeNumber: string;
  name: string;
  origin: string;
  destination: string;
  city: string;
  status: RouteStatus;
  totalStops: number;
  createdAt: string;
  updatedAt: string;
}

export interface RouteWithStops extends Route {
  stops: RouteStop[];
}

export interface CreateRouteInput {
  routeNumber: string;
  name: string;
  origin: string;
  destination: string;
  city: string;
  stops: { stopId: string; sequence: number }[];
}

export interface UpdateRouteInput {
  name?: string;
  origin?: string;
  destination?: string;
  city?: string;
  status?: RouteStatus;
}

// ─── Buses ──────────────────────────────────────────────────

export type BusType = 'mini' | 'regular' | 'ac' | 'deluxe';
export type BusStatus = 'active' | 'inactive' | 'maintenance';

export interface Bus {
  id: string;
  registrationNumber: string;
  type: BusType;
  capacity: number;
  city: string;
  status: BusStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBusInput {
  registrationNumber: string;
  type?: BusType;
  capacity: number;
  city: string;
}

export interface UpdateBusInput {
  type?: BusType;
  capacity?: number;
  city?: string;
  status?: BusStatus;
}

// ─── Trips ──────────────────────────────────────────────────

export type TripStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled';

export interface Trip {
  id: string;
  busId: string;
  routeId: string;
  driverId: string;
  conductorId: string | null;
  status: TripStatus;
  startedAt: string | null;
  endedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTripInput {
  busId: string;
  routeId: string;
  driverId: string;
  conductorId?: string;
}

export interface UpdateTripInput {
  status?: TripStatus;
  conductorId?: string;
}

// ─── Trip Locations ─────────────────────────────────────────

export interface TripLocation {
  id: string;
  tripId: string;
  lat: string;
  lon: string;
  speed: string | null;
  heading: string | null;
  recordedAt: string;
}

export interface AddLocationsInput {
  locations: {
    lat: string;
    lon: string;
    speed?: string;
    heading?: string;
  }[];
}
