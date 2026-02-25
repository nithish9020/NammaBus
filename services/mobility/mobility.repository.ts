import { eq } from "drizzle-orm";
import { db } from "../src/db";
import { stop } from "../src/db/schema";

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
