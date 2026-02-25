import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";

// Mobility: Stops table
export const stop = pgTable("stop", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  // Store latitude/longitude as text for simplicity (can be changed to numeric/decimal later)
  lat: text("lat").notNull(),
  lon: text("lon").notNull(),
  city: text("city").notNull(),
  pincode: text("pincode").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
