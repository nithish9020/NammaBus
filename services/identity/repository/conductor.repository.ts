import { eq } from "drizzle-orm";
import { db } from "../../src/db";
import { conductor } from "../../src/db/schema";
import type { CreateConductorInput, UpdateConductorInput } from "../../src/types/identity.types";

export const conductorRepository = {
  async createConductor(data: CreateConductorInput) {
    const [row] = await db.insert(conductor).values(data).returning();
    return row;
  },

  async findAllConductors() {
    return db.select().from(conductor);
  },

  async findConductorById(id: string) {
    const rows = await db
      .select()
      .from(conductor)
      .where(eq(conductor.id, id));
    return rows[0] ?? null;
  },

  async updateConductor(id: string, data: UpdateConductorInput) {
    const [row] = await db
      .update(conductor)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(conductor.id, id))
      .returning();
    return row ?? null;
  },

  async deleteConductor(id: string) {
    const [row] = await db
      .delete(conductor)
      .where(eq(conductor.id, id))
      .returning();
    return row ?? null;
  },
};
