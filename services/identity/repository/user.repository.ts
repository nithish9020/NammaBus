import { eq } from "drizzle-orm";
import { db } from "../../src/db";
import { user } from "../../src/db/schema";

export const userRepository = {
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
};
