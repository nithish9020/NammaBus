// Auth — handled by better-auth, full path from root (no /api prefix)
export const AUTH_ENDPOINTS = {
  SIGN_IN:     '/api/auth/sign-in/email',
  SIGN_OUT:    '/api/auth/sign-out',
  GET_SESSION: '/api/auth/get-session',
} as const;

// Identity
export const IDENTITY_ENDPOINTS = {
  // Users (read-only from frontend)
  USERS:             '/api/identity/users',
  USER_BY_ID:        (id: string) => `/api/identity/users/${id}`,
  USER_BY_EMAIL:     (email: string) => `/api/identity/users/email/${email}`,

  // Drivers
  DRIVERS:           '/api/identity/drivers',
  DRIVER_BY_ID:      (id: string) => `/api/identity/drivers/${id}`,

  // Conductors
  CONDUCTORS:        '/api/identity/conductors',
  CONDUCTOR_BY_ID:   (id: string) => `/api/identity/conductors/${id}`,
} as const;

// Mobility
export const MOBILITY_ENDPOINTS = {
  // Stops
  STOPS:             '/api/mobility/stops',
  STOP_BY_ID:        (id: string) => `/api/mobility/stops/${id}`,

  // Routes
  ROUTES:            '/api/mobility/routes',
  ROUTE_BY_ID:       (id: string) => `/api/mobility/routes/${id}`,
  ROUTE_STOPS:       (id: string) => `/api/mobility/routes/${id}/stops`,

  // Buses
  BUSES:             '/api/mobility/buses',
  BUS_BY_ID:         (id: string) => `/api/mobility/buses/${id}`,

  // Trips
  TRIPS:             '/api/mobility/trips',
  TRIP_BY_ID:        (id: string) => `/api/mobility/trips/${id}`,

  // Trip Locations (GPS)
  TRIP_LOCATIONS:         (tripId: string) => `/api/mobility/trips/${tripId}/locations`,
  TRIP_LOCATION_LATEST:   (tripId: string) => `/api/mobility/trips/${tripId}/locations/latest`,
} as const;

// Realtime
export const REALTIME_ENDPOINTS = {
  STATS: '/api/realtime/stats',
} as const;
