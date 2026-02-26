import { eq } from "drizzle-orm";
import { db } from "../src/db";
import { user, driver, conductor } from "../src/db/schema";
import type {
  CreateDriverInput,
  UpdateDriverInput,
  CreateConductorInput,
  UpdateConductorInput,
} from "../src/types/identity.types";

// Repository layer — direct database access only.
// No business logic here. Just queries.

export const identityRepository = {
  // ─── Users ───────────────────────────────────────────────
  async findAllUsers() {
    return db.select().from(user);
  },

  async findUserById(id: string) {
    const rows = await db.select().from(user).where(eq(user.id, id));
    return rows[0] ?? null;
  },

  async findUserByEmail(email: string) {
    const rows = await db.select().from(user).where(eq(user.email, email));
    return rows[0] ?? null;
  },

  // ─── Drivers ─────────────────────────────────────────────
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

  // ─── Conductors ──────────────────────────────────────────
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
