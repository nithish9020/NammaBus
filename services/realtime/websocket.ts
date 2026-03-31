import type WebSocket from "ws";
import { WebSocketServer } from "ws";
import type { Server } from "http";
import type { IncomingMessage } from "http";
import { roomManager } from "./roomManager";
import { publisher } from "../src/lib/redis";
import { auth } from "../src/lib/auth";
import { fromNodeHeaders } from "better-auth/node";

/**
 * WebSocket message protocol:
 *
 * Connection: ws://host/ws (must include session cookie)
 * Unauthenticated connections are closed with code 4001.
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
 *   { "type": "trip:ended",   tripId }
 *   { "type": "error", "message": "..." }
 */

/** Verify session cookie from the WS upgrade request */
async function verifySession(req: IncomingMessage): Promise<{ userId: string } | null> {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });
    if (!session?.user?.id) return null;
    return { userId: session.user.id };
  } catch {
    return null;
  }
}

/**
 * Attach WebSocket server to an existing HTTP server.
 * Upgrades connections at the /ws path.
 * Both HTTP (Express) and WebSocket share the SAME port.
 *
 * Auth: verifyClient checks session cookie BEFORE the upgrade completes.
 * Unauthenticated requests get HTTP 401 — the WS handshake never finishes.
 */
export function attachWebSocket(httpServer: Server) {
  const wss = new WebSocketServer({
    server: httpServer,
    path: "/ws",
    verifyClient: async (info, callback) => {
      const identity = await verifySession(info.req);
      if (!identity) {
        callback(false, 401, "Unauthorized");
        console.log("[ws] rejected — no valid session");
        return;
      }
      // Stash userId on the request so the connection handler can read it
      (info.req as any)._userId = identity.userId;
      callback(true);
    },
  });

  wss.on("connection", (ws: WebSocket, req: IncomingMessage) => {
    const userId = (req as any)._userId as string;
    console.log(`[ws] connected user:${userId.slice(0, 8)}…`);

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

          // Send the latest known position immediately so the passenger
          // doesn't stare at a blank map until the next GPS ping arrives.
          publisher.get(`trip:${msg.tripId}:latest`)
            .then((cached) => {
              if (cached && ws.readyState === ws.OPEN) {
                ws.send(cached); // already a JSON string
              }
            })
            .catch((err) => console.error("[ws] failed to fetch latest:", err.message));
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
