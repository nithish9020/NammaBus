import { publisher, subscriber } from "../src/lib/redis";
import { roomManager } from "./roomManager";

/**
 * Redis Pub/Sub bridge.
 *
 * Flow:
 *   Driver POST GPS → tripLocationService → publish(tripId, data)
 *                                               ↓
 *                                         Redis channel "trip:<tripId>"
 *                                               ↓
 *                                         subscriber receives message
 *                                               ↓
 *                                         roomManager.broadcast(tripId, data)
 *                                               ↓
 *                                         All WebSocket clients watching that trip
 */

const CHANNEL_PREFIX = "trip:";

export const redisPubSub = {
  /**
   * Publish GPS data to a trip's Redis channel.
   * Called from tripLocationService when driver sends GPS.
   */
  async publish(tripId: string, data: object) {
    const channel = `${CHANNEL_PREFIX}${tripId}`;
    await publisher.publish(channel, JSON.stringify(data));
  },

  /**
   * Start listening for messages on all trip channels.
   * Called once on server startup.
   *
   * Uses psubscribe("trip:*") — pattern subscribe — so we don't
   * need to subscribe to each trip individually.
   */
  async init() {
    await subscriber.psubscribe(`${CHANNEL_PREFIX}*`);
    console.log("[redis] subscribed to trip:* channels");

    subscriber.on("pmessage", (_pattern, channel, message) => {
      // channel = "trip:<tripId>", extract the tripId
      const tripId = channel.slice(CHANNEL_PREFIX.length);

      try {
        const data = JSON.parse(message);
        roomManager.broadcast(tripId, data);
      } catch (err) {
        console.error("[redis] failed to parse message:", err);
      }
    });
  },
};
