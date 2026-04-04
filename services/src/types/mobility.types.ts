export interface Stop {
  id: string;
  name: string;
  lat: string;
  lon: string;
  city: string;
  pincode: string;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Route ─────────────────────────────────────────────────

export type RouteStatus = "active" | "inactive" | "suspended";

export interface Route {
  id: string;
  routeNumber: string;
  name: string;
  origin: string;
  destination: string;
  city: string;
  color?: string | null;
  status: RouteStatus;
  totalStops: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface RouteStop {
  id: string;
  routeId: string;
  stopId: string;
  sequence: number;
  createdAt: Date;
}

/** Route with its stops populated and ordered */
export interface RouteWithStops extends Route {
  stops: (RouteStop & { stop: Stop })[];
}

/** Input to create a route */
export interface CreateRouteInput {
  routeNumber: string;
  name: string;
  origin: string;
  destination: string;
  city: string;
  color?: string;
  stops: { stopId: string; sequence: number }[];
}

/** Input to update route metadata (not stops) */
export interface UpdateRouteInput {
  name?: string;
  origin?: string;
  destination?: string;
  city?: string;
  status?: RouteStatus;
}

// ─── Bus ───────────────────────────────────────────────────

export type BusType = "mini" | "regular" | "ac" | "deluxe";
export type BusStatus = "active" | "inactive" | "maintenance";

export interface Bus {
  id: string;
  registrationNumber: string;
  type: BusType;
  capacity: number;
  city: string;
  status: BusStatus;
  createdAt: Date;
  updatedAt: Date;
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

// ─── Trip ──────────────────────────────────────────────────

export type TripStatus = "scheduled" | "in_progress" | "completed" | "cancelled";

export interface Trip {
  id: string;
  busId: string;
  routeId: string;
  driverId: string;
  conductorId: string | null;
  status: TripStatus;
  startedAt: Date | null;
  endedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
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

// ─── Trip Location (GPS pings for ETA) ─────────────────────

export interface TripLocation {
  id: string;
  tripId: string;
  lat: string;
  lon: string;
  speed: string | null;
  heading: string | null;
  recordedAt: Date;
}
