import type WebSocket from "ws";
import { WebSocketServer } from "ws";
import type { Server } from "http";
import { roomManager } from "./roomManager";

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

/**
 * Attach WebSocket server to an existing HTTP server.
 * Upgrades connections at the /ws path.
 * Both HTTP (Express) and WebSocket share the SAME port.
 */
export function attachWebSocket(httpServer: Server) {
  const wss = new WebSocketServer({ server: httpServer, path: "/ws" });

  wss.on("connection", (ws: WebSocket) => {
    console.log("[ws] new connection");

    ws.on("message", (raw: Buffer | string) => {
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
    });

    ws.on("close", () => {
      roomManager.removeAll(ws);
      console.log("[ws] connection closed");
    });
  });

  return wss;
}
