import { DEFAULT_BASE_URL, WS_PATH } from '../constants/config';
import type { WsClientMessage, WsServerMessage } from './types';

export type WsMessageHandler = (msg: WsServerMessage) => void;
export type WsStatusHandler = (status: 'connected' | 'disconnected' | 'error') => void;

export interface NammaBusWsClient {
  subscribe: (tripId: string) => void;
  unsubscribe: (tripId: string) => void;
  ping: () => void;
  disconnect: () => void;
}

/**
 * Creates and manages a single WebSocket connection.
 *
 * Usage:
 *   const ws = createWsClient({
 *     baseUrl: 'http://localhost:3000',
 *     onMessage: (msg) => { ... },
 *     onStatus:  (s)   => { ... },
 *   });
 *   ws.subscribe('trip-uuid');
 *   ws.disconnect(); // call on component unmount
 */
export function createWsClient(options: {
  baseUrl?: string;
  onMessage: WsMessageHandler;
  onStatus?: WsStatusHandler;
}): NammaBusWsClient {
  const baseUrl = options.baseUrl ?? DEFAULT_BASE_URL;
  const wsUrl = baseUrl.replace(/^http/, 'ws') + WS_PATH;

  const socket = new WebSocket(wsUrl);

  socket.onopen = () => {
    options.onStatus?.('connected');
  };

  socket.onclose = () => {
    options.onStatus?.('disconnected');
  };

  socket.onerror = () => {
    options.onStatus?.('error');
  };

  socket.onmessage = (event: MessageEvent) => {
    try {
      const msg = JSON.parse(event.data as string) as WsServerMessage;
      options.onMessage(msg);
    } catch {
      // malformed message — ignore
    }
  };

  function send(msg: WsClientMessage) {
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(msg));
    }
  }

  return {
    subscribe:   (tripId) => send({ type: 'subscribe',   tripId }),
    unsubscribe: (tripId) => send({ type: 'unsubscribe', tripId }),
    ping:        ()       => send({ type: 'ping' }),
    disconnect:  ()       => socket.close(),
  };
}
