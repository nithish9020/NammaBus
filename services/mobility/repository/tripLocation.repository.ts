import { eq, asc, desc } from "drizzle-orm";
import { db } from "../../src/db";
import { tripLocation } from "../../src/db/schema";

export const tripLocationRepository = {
  /** Bulk insert GPS pings for a trip */
  async insertLocations(
    tripId: string,
    locations: { lat: string; lon: string; speed?: string; heading?: string; recordedAt?: Date }[]
  ) {
    const rows = await db
      .insert(tripLocation)
      .values(locations.map((loc) => ({ tripId, ...loc })))
      .returning();
    return rows;
  },

  /** Get all locations for a trip, ordered by time */
  async findLocationsByTripId(tripId: string) {
    return db
      .select()
      .from(tripLocation)
      .where(eq(tripLocation.tripId, tripId))
      .orderBy(asc(tripLocation.recordedAt));
  },

  /** Get the latest location for a trip */
  async findLatestLocation(tripId: string) {
    const rows = await db
      .select()
      .from(tripLocation)
      .where(eq(tripLocation.tripId, tripId))
      .orderBy(desc(tripLocation.recordedAt))
      .limit(1);
    return rows[0] ?? null;
  },
};
