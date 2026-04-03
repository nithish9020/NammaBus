import type { 
  AuthUser,
  Driver, Conductor, 
  Stop, Route, RouteStop, RouteWithStops, 
  Bus, Trip, TripLocation,
  StaffStatus, RouteStatus, BusType, BusStatus, TripStatus 
} from "@nammabus/shared/types";

export type { 
  AuthUser,
  Driver, Conductor, 
  Stop, Route, RouteStop, RouteWithStops, 
  Bus, Trip, TripLocation,
  StaffStatus, RouteStatus, BusType, BusStatus, TripStatus 
};

// Aliases as per guide
export type User = AuthUser;
export type DriverStatus = StaffStatus;

export type DashboardView = "map" | "tile" | "table";
export type RouteView = "map" | "table";
export type StopView = "map" | "table";
export type StaffView = "drivers" | "conductors";
