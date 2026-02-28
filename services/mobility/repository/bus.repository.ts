import { eq, asc } from "drizzle-orm";
import { db } from "../../src/db";
import { bus } from "../../src/db/schema";

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
