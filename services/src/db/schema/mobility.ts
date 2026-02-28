import {
  pgTable,
  pgEnum,
  uuid,
  text,
  integer,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

// ─── Enums ─────────────────────────────────────────────────
export const routeStatusEnum = pgEnum("route_status", [
  "active",
  "inactive",
  "suspended",
]);

// ─── Stops ─────────────────────────────────────────────────
export const stop = pgTable("stop", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  lat: text("lat").notNull(),
  lon: text("lon").notNull(),
  city: text("city").notNull(),
  pincode: text("pincode").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ─── Routes ────────────────────────────────────────────────
export const route = pgTable("route", {
  id: uuid("id").primaryKey().defaultRandom(),
  routeNumber: text("route_number").notNull().unique(), // e.g. "3", "15A"
  name: text("name").notNull(), // e.g. "Ukkadam - Kovaipudur Pirivu"
  origin: text("origin").notNull(), // first stop name
  destination: text("destination").notNull(), // last stop name
  city: text("city").notNull(),
  status: routeStatusEnum("status").notNull().default("active"),
  totalStops: integer("total_stops").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ─── Route ↔ Stop junction (ordered) ──────────────────────
export const routeStop = pgTable(
  "route_stop",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    routeId: uuid("route_id")
      .notNull()
      .references(() => route.id, { onDelete: "cascade" }),
    stopId: uuid("stop_id")
      .notNull()
      .references(() => stop.id, { onDelete: "cascade" }),
    sequence: integer("sequence").notNull(), // 1, 2, 3... order in the route
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("route_stop_unique").on(table.routeId, table.stopId),
  ]
);
