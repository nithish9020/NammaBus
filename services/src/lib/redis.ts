import Redis from "ioredis";
import { env } from "./env";

/**
 * Two separate Redis connections from the same Upstash URL:
 *
 * publisher  — used to publish messages (GPS data → route channels)
 * subscriber — used to listen for messages (enters "subscriber mode")
 *
 * Why two? Once a Redis connection calls .subscribe(), it enters
 * subscriber mode and can ONLY listen — it can't publish or run
 * other commands. So we need a dedicated connection for each role.
 */

export const publisher = new Redis(env.REDIS_URL, {
  lazyConnect: true,            // don't connect until first use
  maxRetriesPerRequest: 3,
});

export const subscriber = new Redis(env.REDIS_URL, {
  lazyConnect: true,
  maxRetriesPerRequest: 3,
});

// ─── Connection event logging ──────────────────────────────
publisher.on("connect", () => console.log("[redis] publisher connected"));
publisher.on("error", (err) => console.error("[redis] publisher error:", err.message));

subscriber.on("connect", () => console.log("[redis] subscriber connected"));
subscriber.on("error", (err) => console.error("[redis] subscriber error:", err.message));
