import express from "express";
import { toNodeHandler } from "better-auth/node";
import identityRoutes from "../identity/identity.routes";
import mobilityRoutes from "../mobility/mobility.routes";
import realtimeRoutes from "../realtime/realtime.routes";
import predictionRoutes from "../prediction/prediction.routes";
import { websocketHandler } from "../realtime/websocket";
import { redisPubSub } from "../realtime/redisPubSub";
import type { WSData } from "../realtime/roomManager";
import { env } from "./lib/env";
import { auth } from "./lib/auth";


const app = express();

app.all("/api/auth/*", toNodeHandler(auth));

app.use(express.json());

app.use("/api/identity", identityRoutes);
app.use("/api/mobility", mobilityRoutes);
app.use("/api/realtime", realtimeRoutes);
app.use("/api/prediction", predictionRoutes);

// ─── HTTP server (Express as usual) ────────────────────────
app.listen(env.PORT, () => {
  console.log(`NammaBus HTTP running on http://localhost:${env.PORT}`);
});

// ─── WebSocket server (Bun native, PORT + 1) ───────────────
const WS_PORT = env.PORT + 1;

Bun.serve({
  port: WS_PORT,

  fetch(req, server) {
    if (new URL(req.url).pathname === "/ws") {
      const upgraded = server.upgrade(req, {
        data: { subscribedTrips: new Set() } as WSData,
      });
      if (upgraded) return undefined;
      return new Response("WebSocket upgrade failed", { status: 400 });
    }
    return new Response("NammaBus WebSocket — connect via ws://", { status: 200 });
  },

  websocket: websocketHandler,
});

console.log(`NammaBus WebSocket running on ws://localhost:${WS_PORT}/ws`);

// ─── Start Redis subscription listener ─────────────────────
redisPubSub.init().catch((err) => {
  console.error("[redis] Failed to init pub/sub:", err.message);
});
