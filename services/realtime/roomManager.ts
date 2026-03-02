import type { ServerWebSocket } from "bun";

/**
 * In-memory pub/sub room manager for realtime bus tracking.
 *
 * A "room" = a trip ID. Everyone watching the same trip is in the same room.
 * - subscribe(tripId, ws)   → passenger joins the room
 * - unsubscribe(tripId, ws) → passenger leaves the room
 * - broadcast(tripId, data) → push data to ALL passengers in that room
 *
 * Why tripId (not routeId)?
 *   A bus can serve different routes on different days.
 *   A trip ties together bus + route + driver + time window.
 *   Trip = the single live journey a passenger is tracking.
 *
 * Structure: Map<tripId, Set<WebSocket>>
 * - Map  → O(1) lookup by trip
 * - Set  → O(1) add/remove, prevents duplicates
 */

export type WSData = {
  subscribedTrips: Set<string>;
};

const rooms = new Map<string, Set<ServerWebSocket<WSData>>>();

export const roomManager = {
  subscribe(tripId: string, ws: ServerWebSocket<WSData>) {
    if (!rooms.has(tripId)) rooms.set(tripId, new Set());
    rooms.get(tripId)!.add(ws);
    ws.data.subscribedTrips.add(tripId);
    console.log(`[ws] +subscribe trip:${tripId.slice(0, 8)}… (${rooms.get(tripId)!.size} watchers)`);
  },

  unsubscribe(tripId: string, ws: ServerWebSocket<WSData>) {
    const room = rooms.get(tripId);
    if (!room) return;
    room.delete(ws);
    ws.data.subscribedTrips.delete(tripId);
    if (room.size === 0) rooms.delete(tripId);
    console.log(`[ws] -unsubscribe trip:${tripId.slice(0, 8)}…`);
  },

  /** Remove a ws from ALL rooms (called on disconnect) */
  removeAll(ws: ServerWebSocket<WSData>) {
    for (const tripId of ws.data.subscribedTrips) {
      const room = rooms.get(tripId);
      if (room) {
        room.delete(ws);
        if (room.size === 0) rooms.delete(tripId);
      }
    }
    ws.data.subscribedTrips.clear();
  },

  /** Push data to every WebSocket in a trip's room */
  broadcast(tripId: string, data: object) {
    const room = rooms.get(tripId);
    if (!room || room.size === 0) return;
    const message = JSON.stringify(data);
    for (const ws of room) ws.send(message);
    console.log(`[ws] broadcast trip:${tripId.slice(0, 8)}… → ${room.size} watchers`);
  },

  getWatcherCount(tripId: string): number {
    return rooms.get(tripId)?.size ?? 0;
  },

  getStats(): { tripId: string; watchers: number }[] {
    return Array.from(rooms.entries()).map(([tripId, set]) => ({
      tripId,
      watchers: set.size,
    }));
  },
};
