// Messages the CLIENT sends TO the server
export interface WsSubscribeMessage {
  type: 'subscribe';
  tripId: string;
}

export interface WsUnsubscribeMessage {
  type: 'unsubscribe';
  tripId: string;
}

export interface WsPingMessage {
  type: 'ping';
}

export type WsClientMessage =
  | WsSubscribeMessage
  | WsUnsubscribeMessage
  | WsPingMessage;

// Messages the SERVER sends TO the client
export interface WsSubscribedMessage {
  type: 'subscribed';
  tripId: string;
}

export interface WsUnsubscribedMessage {
  type: 'unsubscribed';
  tripId: string;
}

export interface WsPongMessage {
  type: 'pong';
}

export interface WsBusLocationMessage {
  type: 'bus:location';
  tripId: string;
  busId: string;
  lat: string;
  lon: string;
  speed: string | null;
  heading: string | null;
  recordedAt: string;
}

export interface WsTripEndedMessage {
  type: 'trip:ended';
  tripId: string;
}

export interface WsErrorMessage {
  type: 'error';
  message: string;
}

export type WsServerMessage =
  | WsSubscribedMessage
  | WsUnsubscribedMessage
  | WsPongMessage
  | WsBusLocationMessage
  | WsTripEndedMessage
  | WsErrorMessage;
