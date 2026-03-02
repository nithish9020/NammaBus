import { eq } from "drizzle-orm";
import { db } from "../../src/db";
import { driver } from "../../src/db/schema";
import type { CreateDriverInput, UpdateDriverInput } from "../../src/types/identity.types";

export const driverRepository = {
  async createDriver(data: CreateDriverInput) {
    const [row] = await db.insert(driver).values(data).returning();
    return row;
  },

  async findAllDrivers() {
    return db.select().from(driver);
  },

  async findDriverById(id: string) {
    const rows = await db.select().from(driver).where(eq(driver.id, id));
    return rows[0] ?? null;
  },

  async updateDriver(id: string, data: UpdateDriverInput) {
    const [row] = await db
      .update(driver)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(driver.id, id))
      .returning();
    return row ?? null;
  },

  async deleteDriver(id: string) {
    const [row] = await db.delete(driver).where(eq(driver.id, id)).returning();
    return row ?? null;
  },
};
