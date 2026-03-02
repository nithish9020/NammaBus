import express from "express";
import { createServer } from "http";
import { toNodeHandler } from "better-auth/node";
import identityRoutes from "../identity/identity.routes";
import mobilityRoutes from "../mobility/mobility.routes";
import realtimeRoutes from "../realtime/realtime.routes";
import predictionRoutes from "../prediction/prediction.routes";
import { attachWebSocket } from "../realtime/websocket";
import { redisPubSub } from "../realtime/redisPubSub";
import { env } from "./lib/env";
import { auth } from "./lib/auth";

const app = express();

// ─── Wrap Express in a raw HTTP server ─────────────────────
// This lets us attach WebSocket (ws) to the SAME port.
// Express handles HTTP, ws handles WebSocket upgrades at /ws.
const httpServer = createServer(app);

app.all("/api/auth/*", toNodeHandler(auth));

app.use(express.json());

app.use("/api/identity", identityRoutes);
app.use("/api/mobility", mobilityRoutes);
app.use("/api/realtime", realtimeRoutes);
app.use("/api/prediction", predictionRoutes);

// ─── Attach WebSocket to the same HTTP server ──────────────
attachWebSocket(httpServer);

// ─── Start server (HTTP + WebSocket on ONE port) ───────────
httpServer.listen(env.PORT, () => {
  console.log(`NammaBus running on http://localhost:${env.PORT}`);
  console.log(`  HTTP  → http://localhost:${env.PORT}/api/*`);
  console.log(`  WS    → ws://localhost:${env.PORT}/ws`);
});

// ─── Start Redis subscription listener ─────────────────────
redisPubSub.init().catch((err) => {
  console.error("[redis] Failed to init pub/sub:", err.message);
});
