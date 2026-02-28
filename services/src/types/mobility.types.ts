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
