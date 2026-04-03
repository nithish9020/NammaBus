import type {
  Trip as SharedTrip,
  Driver as SharedDriver,
  Conductor as SharedConductor,
  TripStatus,
  Route as SharedRoute,
} from "@nammabus/shared/types";

export type { TripStatus };

export type DashboardView = "map" | "tile" | "table";

export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
}

export interface Driver extends SharedDriver {
  user?: User;
  verified?: boolean;
}

export interface Conductor extends SharedConductor {
  user?: User;
  verified?: boolean;
}

export interface Bus {
  id: string;
  registrationNumber: string;
  type?: string;
  capacity: number;
  city: string;
  status: "active" | "maintenance" | "retired";
}

export interface Stop {
  id: string;
  name: string;
  lat: string;
  lon: string;
  city: string;
  pincode: string;
}

export interface RouteStop {
  stopId: string;
  sequence: number;
  stop?: Stop;
}

export interface Route extends SharedRoute {
  stops?: RouteStop[];
  color?: string;
}

export interface Trip extends SharedTrip {
  bus?: Bus;
  route?: Route;
  driver?: Driver;
  conductor?: Conductor;
}
