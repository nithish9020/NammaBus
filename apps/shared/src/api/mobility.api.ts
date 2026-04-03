import { request } from './client';
import { MOBILITY_ENDPOINTS } from '../constants/endpoints';
import type {
  Stop, Route, RouteWithStops, Bus, Trip, TripLocation,
  CreateStopInput,
  CreateRouteInput, UpdateRouteInput,
  CreateBusInput, UpdateBusInput,
  CreateTripInput, UpdateTripInput,
  AddLocationsInput,
} from '../types';

// ─── Stops ──────────────────────────────────────────────────

export async function getAllStops() {
  return request<Stop[]>('GET', MOBILITY_ENDPOINTS.STOPS);
}

export async function getStopById(id: string) {
  return request<Stop>('GET', MOBILITY_ENDPOINTS.STOP_BY_ID(id));
}

export async function createStop(input: CreateStopInput) {
  return request<Stop>('POST', MOBILITY_ENDPOINTS.STOPS, input);
}

export async function updateStop(id: string, input: Partial<CreateStopInput>) {
  return request<Stop>('PUT', MOBILITY_ENDPOINTS.STOP_BY_ID(id), input);
}

export async function deleteStop(id: string) {
  return request<void>('DELETE', MOBILITY_ENDPOINTS.STOP_BY_ID(id));
}

// ─── Routes ─────────────────────────────────────────────────

export async function getAllRoutes() {
  return request<{ routes: Route[] }>('GET', MOBILITY_ENDPOINTS.ROUTES);
}

export async function getRouteById(id: string) {
  return request<{ route: RouteWithStops }>('GET', MOBILITY_ENDPOINTS.ROUTE_BY_ID(id));
}

export async function createRoute(input: CreateRouteInput) {
  return request<{ route: RouteWithStops }>('POST', MOBILITY_ENDPOINTS.ROUTES, input);
}

export async function updateRoute(id: string, input: UpdateRouteInput) {
  return request<{ route: Route }>('PATCH', MOBILITY_ENDPOINTS.ROUTE_BY_ID(id), input);
}

export async function replaceRouteStops(
  id: string,
  stops: { stopId: string; sequence: number }[],
) {
  return request<{ route: RouteWithStops }>('PUT', MOBILITY_ENDPOINTS.ROUTE_STOPS(id), { stops });
}

export async function deleteRoute(id: string) {
  return request<void>('DELETE', MOBILITY_ENDPOINTS.ROUTE_BY_ID(id));
}

// ─── Buses ──────────────────────────────────────────────────

export async function getAllBuses() {
  return request<{ buses: Bus[] }>('GET', MOBILITY_ENDPOINTS.BUSES);
}

export async function getBusById(id: string) {
  return request<{ bus: Bus }>('GET', MOBILITY_ENDPOINTS.BUS_BY_ID(id));
}

export async function createBus(input: CreateBusInput) {
  return request<{ bus: Bus }>('POST', MOBILITY_ENDPOINTS.BUSES, input);
}

export async function updateBus(id: string, input: UpdateBusInput) {
  return request<{ bus: Bus }>('PATCH', MOBILITY_ENDPOINTS.BUS_BY_ID(id), input);
}

export async function deleteBus(id: string) {
  return request<void>('DELETE', MOBILITY_ENDPOINTS.BUS_BY_ID(id));
}

// ─── Trips ──────────────────────────────────────────────────

/**
 * @param status  Optional filter: 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
 */
export async function getAllTrips(status?: string) {
  const path = status
    ? `${MOBILITY_ENDPOINTS.TRIPS}?status=${status}`
    : MOBILITY_ENDPOINTS.TRIPS;
  return request<{ trips: Trip[] }>('GET', path);
}

export async function getTripById(id: string) {
  return request<{ trip: Trip }>('GET', MOBILITY_ENDPOINTS.TRIP_BY_ID(id));
}

export async function createTrip(input: CreateTripInput) {
  return request<{ trip: Trip }>('POST', MOBILITY_ENDPOINTS.TRIPS, input);
}

export async function updateTrip(id: string, input: UpdateTripInput) {
  return request<{ trip: Trip }>('PATCH', MOBILITY_ENDPOINTS.TRIP_BY_ID(id), input);
}

export async function deleteTrip(id: string) {
  return request<void>('DELETE', MOBILITY_ENDPOINTS.TRIP_BY_ID(id));
}

// ─── Trip Locations ─────────────────────────────────────────

export async function addTripLocations(tripId: string, input: AddLocationsInput) {
  return request<{ locations: TripLocation[] }>(
    'POST',
    MOBILITY_ENDPOINTS.TRIP_LOCATIONS(tripId),
    input,
  );
}

export async function getTripLocations(tripId: string) {
  return request<{ locations: TripLocation[] }>(
    'GET',
    MOBILITY_ENDPOINTS.TRIP_LOCATIONS(tripId),
  );
}

export async function getLatestTripLocation(tripId: string) {
  return request<{ location: TripLocation }>(
    'GET',
    MOBILITY_ENDPOINTS.TRIP_LOCATION_LATEST(tripId),
  );
}
