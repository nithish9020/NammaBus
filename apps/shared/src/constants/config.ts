// Override with VITE_PUBLIC_API_URL (web) or EXPO_PUBLIC_API_URL (mobile)
export const DEFAULT_BASE_URL = 'http://localhost:3000';

export const WS_PATH = '/ws';

// WebSocket message types (client → server)
export const WS_CLIENT_TYPES = {
  SUBSCRIBE:   'subscribe',
  UNSUBSCRIBE: 'unsubscribe',
  PING:        'ping',
} as const;

// WebSocket message types (server → client)
export const WS_SERVER_TYPES = {
  SUBSCRIBED:   'subscribed',
  UNSUBSCRIBED: 'unsubscribed',
  PONG:         'pong',
  BUS_LOCATION: 'bus:location',
  TRIP_ENDED:   'trip:ended',
  ERROR:        'error',
} as const;
