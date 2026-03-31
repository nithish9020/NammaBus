import type WebSocket from "ws";

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
 * Structure:
 *   rooms           → Map<tripId, Set<WebSocket>>
 *   clientTrips     → Map<WebSocket, Set<tripId>>  (reverse lookup for cleanup)
 */

const rooms = new Map<string, Set<WebSocket>>();
const clientTrips = new Map<WebSocket, Set<string>>();

export const roomManager = {
  subscribe(tripId: string, ws: WebSocket) {
    if (!rooms.has(tripId)) rooms.set(tripId, new Set());
    rooms.get(tripId)!.add(ws);

    if (!clientTrips.has(ws)) clientTrips.set(ws, new Set());
    clientTrips.get(ws)!.add(tripId);

    console.log(`[ws] +subscribe trip:${tripId.slice(0, 8)}… (${rooms.get(tripId)!.size} watchers)`);
  },

  unsubscribe(tripId: string, ws: WebSocket) {
    const room = rooms.get(tripId);
    if (!room) return;
    room.delete(ws);
    if (room.size === 0) rooms.delete(tripId);

    clientTrips.get(ws)?.delete(tripId);

    console.log(`[ws] -unsubscribe trip:${tripId.slice(0, 8)}…`);
  },

  /** Remove a ws from ALL rooms (called on disconnect) */
  removeAll(ws: WebSocket) {
    const trips = clientTrips.get(ws);
    if (!trips) return;

    for (const tripId of trips) {
      const room = rooms.get(tripId);
      if (room) {
        room.delete(ws);
        if (room.size === 0) rooms.delete(tripId);
      }
    }
    clientTrips.delete(ws);
  },

  /** Push data to every WebSocket in a trip's room */
  broadcast(tripId: string, data: object) {
    const room = rooms.get(tripId);
    if (!room || room.size === 0) return;
    const message = JSON.stringify(data);
    for (const ws of room) {
      if (ws.readyState === ws.OPEN) ws.send(message);
    }
    console.log(`[ws] broadcast trip:${tripId.slice(0, 8)}… → ${room.size} watchers`);
  },

  getWatcherCount(tripId: string): number {
    return rooms.get(tripId)?.size ?? 0;
  },

  /**
   * End a trip room: broadcast trip:ended to all watchers,
   * remove all clients from the room, and delete the room.
   * Called when a trip is completed or cancelled.
   */
  closeRoom(tripId: string) {
    const room = rooms.get(tripId);
    if (!room || room.size === 0) {
      rooms.delete(tripId);
      return;
    }

    const message = JSON.stringify({ type: "trip:ended", tripId });
    for (const ws of room) {
      if (ws.readyState === ws.OPEN) ws.send(message);
      // Remove this trip from the client's reverse lookup
      clientTrips.get(ws)?.delete(tripId);
    }

    rooms.delete(tripId);
    console.log(`[ws] closeRoom trip:${tripId.slice(0, 8)}… (room deleted)`);
  },

  getStats(): { tripId: string; watchers: number }[] {
    return Array.from(rooms.entries()).map(([tripId, set]) => ({
      tripId,
      watchers: set.size,
    }));
  },
};
