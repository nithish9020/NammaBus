import {
  pgTable,
  pgEnum,
  uuid,
  text,
  integer,
  numeric,
  timestamp,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";
import { driver, conductor } from "./identity";

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

// ─── Buses ─────────────────────────────────────────────────
export const busTypeEnum = pgEnum("bus_type", [
  "mini",
  "regular",
  "ac",
  "deluxe",
]);

export const busStatusEnum = pgEnum("bus_status", [
  "active",
  "inactive",
  "maintenance",
]);

export const bus = pgTable("bus", {
  id: uuid("id").primaryKey().defaultRandom(),
  registrationNumber: text("registration_number").notNull().unique(), // e.g. "TN-43-N-1234"
  type: busTypeEnum("type").notNull().default("regular"),
  capacity: integer("capacity").notNull(),
  city: text("city").notNull(),
  status: busStatusEnum("status").notNull().default("active"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ─── Trips ─────────────────────────────────────────────────
export const tripStatusEnum = pgEnum("trip_status", [
  "scheduled",
  "in_progress",
  "completed",
  "cancelled",
]);

export const trip = pgTable(
  "trip",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    busId: uuid("bus_id")
      .notNull()
      .references(() => bus.id, { onDelete: "cascade" }),
    routeId: uuid("route_id")
      .notNull()
      .references(() => route.id, { onDelete: "cascade" }),
    driverId: uuid("driver_id")
      .notNull()
      .references(() => driver.id, { onDelete: "cascade" }),
    conductorId: uuid("conductor_id").references(() => conductor.id, {
      onDelete: "set null",
    }), // optional
    status: tripStatusEnum("status").notNull().default("scheduled"),
    startedAt: timestamp("started_at"),
    endedAt: timestamp("ended_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [index("trip_status_idx").on(table.status)]
);

// ─── Trip GPS Locations (for ETA) ──────────────────────────
export const tripLocation = pgTable(
  "trip_location",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    tripId: uuid("trip_id")
      .notNull()
      .references(() => trip.id, { onDelete: "cascade" }),
    lat: numeric("lat", { precision: 10, scale: 7 }).notNull(),
    lon: numeric("lon", { precision: 10, scale: 7 }).notNull(),
    speed: numeric("speed", { precision: 5, scale: 2 }),       // km/h
    heading: numeric("heading", { precision: 5, scale: 2 }),   // degrees 0-360
    recordedAt: timestamp("recorded_at").notNull().defaultNow(),
  },
  (table) => [
    index("trip_location_trip_idx").on(table.tripId),
    index("trip_location_time_idx").on(table.tripId, table.recordedAt),
  ]
);
