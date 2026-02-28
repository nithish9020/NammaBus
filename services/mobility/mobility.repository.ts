import { eq, asc } from "drizzle-orm";
import { db } from "../src/db";
import { stop, route, routeStop, bus } from "../src/db/schema";

// ─── Stop Repository ───────────────────────────────────────

export const mobilityRepository = {
  async createStop(data: { name: string; lat: string; lon: string; city: string; pincode: string }) {
    const [row] = await db.insert(stop).values(data).returning();
    return row;
  },

  async findAllStops() {
    return db.select().from(stop);
  },

  async findStopById(id: string) {
    const rows = await db.select().from(stop).where(eq(stop.id, id));
    return rows[0] ?? null;
  },

  async updateStop(id: string, data: Partial<{ name: string; lat: string; lon: string; city: string; pincode: string }>) {
    const [row] = await db.update(stop).set(data).where(eq(stop.id, id)).returning();
    return row ?? null;
  },

  async deleteStop(id: string) {
    await db.delete(stop).where(eq(stop.id, id));
    return true;
  },
};

// ─── Route Repository ──────────────────────────────────────

export const routeRepository = {
  /** Create a route + link its stops */
  async createRoute(data: {
    routeNumber: string;
    name: string;
    origin: string;
    destination: string;
    city: string;
    stops: { stopId: string; sequence: number }[];
  }) {
    const [newRoute] = await db
      .insert(route)
      .values({
        routeNumber: data.routeNumber,
        name: data.name,
        origin: data.origin,
        destination: data.destination,
        city: data.city,
        totalStops: data.stops.length,
      })
      .returning();

    if (data.stops.length > 0) {
      await db.insert(routeStop).values(
        data.stops.map((s) => ({
          routeId: newRoute.id,
          stopId: s.stopId,
          sequence: s.sequence,
        }))
      );
    }

    return this.findRouteById(newRoute.id);
  },

  /** List all routes (metadata only, no stops) */
  async findAllRoutes() {
    return db.select().from(route).orderBy(asc(route.routeNumber));
  },

  /** Get one route with all stops populated and ordered by sequence */
  async findRouteById(id: string) {
    const rows = await db.select().from(route).where(eq(route.id, id));
    const foundRoute = rows[0] ?? null;
    if (!foundRoute) return null;

    const stops = await db
      .select({
        id: routeStop.id,
        routeId: routeStop.routeId,
        stopId: routeStop.stopId,
        sequence: routeStop.sequence,
        createdAt: routeStop.createdAt,
        stop: {
          id: stop.id,
          name: stop.name,
          lat: stop.lat,
          lon: stop.lon,
          city: stop.city,
          pincode: stop.pincode,
          createdAt: stop.createdAt,
          updatedAt: stop.updatedAt,
        },
      })
      .from(routeStop)
      .innerJoin(stop, eq(routeStop.stopId, stop.id))
      .where(eq(routeStop.routeId, id))
      .orderBy(asc(routeStop.sequence));

    return { ...foundRoute, stops };
  },

  /** Update route metadata (not stops) */
  async updateRoute(
    id: string,
    data: Partial<{
      name: string;
      origin: string;
      destination: string;
      city: string;
      status: "active" | "inactive" | "suspended";
    }>
  ) {
    const [row] = await db
      .update(route)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(route.id, id))
      .returning();
    return row ?? null;
  },

  /** Replace ALL stops for a route (delete old → insert new) */
  async replaceRouteStops(
    routeId: string,
    stops: { stopId: string; sequence: number }[]
  ) {
    await db.delete(routeStop).where(eq(routeStop.routeId, routeId));

    if (stops.length > 0) {
      await db.insert(routeStop).values(
        stops.map((s) => ({
          routeId,
          stopId: s.stopId,
          sequence: s.sequence,
        }))
      );
    }

    await db
      .update(route)
      .set({ totalStops: stops.length, updatedAt: new Date() })
      .where(eq(route.id, routeId));

    return this.findRouteById(routeId);
  },

  /** Delete a route (cascade deletes route_stop rows) */
  async deleteRoute(id: string) {
    await db.delete(route).where(eq(route.id, id));
    return true;
  },
};

// ─── Bus Repository ────────────────────────────────────────

export const busRepository = {
  async createBus(data: {
    registrationNumber: string;
    type?: "mini" | "regular" | "ac" | "deluxe";
    capacity: number;
    city: string;
  }) {
    const [row] = await db.insert(bus).values(data).returning();
    return row;
  },

  async findAllBuses() {
    return db.select().from(bus).orderBy(asc(bus.registrationNumber));
  },

  async findBusById(id: string) {
    const rows = await db.select().from(bus).where(eq(bus.id, id));
    return rows[0] ?? null;
  },

  async updateBus(
    id: string,
    data: Partial<{
      type: "mini" | "regular" | "ac" | "deluxe";
      capacity: number;
      city: string;
      status: "active" | "inactive" | "maintenance";
    }>
  ) {
    const [row] = await db
      .update(bus)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(bus.id, id))
      .returning();
    return row ?? null;
  },

  async deleteBus(id: string) {
    await db.delete(bus).where(eq(bus.id, id));
    return true;
  },
};
