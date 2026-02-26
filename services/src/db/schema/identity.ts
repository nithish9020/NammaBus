import { pgTable, uuid, text, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { user } from "./auth";

// ─── Identity: Staff Enums ───────────────────────────────
export const staffStatusEnum = pgEnum("staff_status", [
  "active",
  "inactive",
  "suspended",
]);

// ─── Identity: Driver Table ─────────────────────────────
export const driver = pgTable("driver", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  licenseNumber: text("license_number").unique().notNull(),
  phone: text("phone").notNull(),
  city: text("city").notNull(),
  status: staffStatusEnum("status").notNull().default("active"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ─── Identity: Conductor Table ──────────────────────────
export const conductor = pgTable("conductor", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  badgeNumber: text("badge_number").unique().notNull(),
  phone: text("phone").notNull(),
  city: text("city").notNull(),
  status: staffStatusEnum("status").notNull().default("active"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
