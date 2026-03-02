import { roomManager, type WSData } from "./roomManager";
import type { ServerWebSocket } from "bun";

/**
 * WebSocket message protocol:
 *
 * Client → Server:
 *   { "type": "subscribe",   "tripId": "uuid" }
 *   { "type": "unsubscribe", "tripId": "uuid" }
 *   { "type": "ping" }
 *
 * Server → Client:
 *   { "type": "subscribed",   "tripId": "uuid" }
 *   { "type": "unsubscribed", "tripId": "uuid" }
 *   { "type": "pong" }
 *   { "type": "bus:location", tripId, busId, lat, lon, speed, heading, recordedAt }
 *   { "type": "error", "message": "..." }
 */

export const websocketHandler = {
  open(ws: ServerWebSocket<WSData>) {
    console.log("[ws] new connection");
  },

  message(ws: ServerWebSocket<WSData>, raw: string | Buffer) {
    let msg: any;
    try {
      msg = JSON.parse(typeof raw === "string" ? raw : raw.toString());
    } catch {
      ws.send(JSON.stringify({ type: "error", message: "Invalid JSON" }));
      return;
    }

    switch (msg.type) {
      case "subscribe": {
        if (!msg.tripId) {
          ws.send(JSON.stringify({ type: "error", message: "tripId is required" }));
          return;
        }
        roomManager.subscribe(msg.tripId, ws);
        ws.send(JSON.stringify({ type: "subscribed", tripId: msg.tripId }));
        break;
      }
      case "unsubscribe": {
        if (!msg.tripId) {
          ws.send(JSON.stringify({ type: "error", message: "tripId is required" }));
          return;
        }
        roomManager.unsubscribe(msg.tripId, ws);
        ws.send(JSON.stringify({ type: "unsubscribed", tripId: msg.tripId }));
        break;
      }
      case "ping": {
        ws.send(JSON.stringify({ type: "pong" }));
        break;
      }
      default: {
        ws.send(JSON.stringify({ type: "error", message: `Unknown type: "${msg.type}"` }));
      }
    }
  },

  close(ws: ServerWebSocket<WSData>) {
    roomManager.removeAll(ws);
    console.log("[ws] connection closed");
  },
};
