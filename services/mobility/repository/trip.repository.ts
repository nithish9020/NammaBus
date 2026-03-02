import { eq, desc } from "drizzle-orm";
import { db } from "../../src/db";
import { trip } from "../../src/db/schema";

export const tripRepository = {
  async createTrip(data: {
    busId: string;
    routeId: string;
    driverId: string;
    conductorId?: string;
  }) {
    const [row] = await db.insert(trip).values(data).returning();
    return row;
  },

  async findAllTrips() {
    return db.select().from(trip).orderBy(desc(trip.createdAt));
  },

  async findTripsByStatus(status: string) {
    return db
      .select()
      .from(trip)
      .where(eq(trip.status, status as any))
      .orderBy(desc(trip.createdAt));
  },

  async findTripById(id: string) {
    const rows = await db.select().from(trip).where(eq(trip.id, id));
    return rows[0] ?? null;
  },

  async updateTrip(
    id: string,
    data: Partial<{
      status: "scheduled" | "in_progress" | "completed" | "cancelled";
      conductorId: string;
      startedAt: Date;
      endedAt: Date;
    }>
  ) {
    const [row] = await db
      .update(trip)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(trip.id, id))
      .returning();
    return row ?? null;
  },

  async deleteTrip(id: string) {
    await db.delete(trip).where(eq(trip.id, id));
    return true;
  },
};
