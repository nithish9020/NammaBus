CREATE TYPE "public"."route_status" AS ENUM('active', 'inactive', 'suspended');--> statement-breakpoint
CREATE TABLE "route" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"route_number" text NOT NULL,
	"name" text NOT NULL,
	"origin" text NOT NULL,
	"destination" text NOT NULL,
	"city" text NOT NULL,
	"status" "route_status" DEFAULT 'active' NOT NULL,
	"total_stops" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "route_route_number_unique" UNIQUE("route_number")
);
--> statement-breakpoint
CREATE TABLE "route_stop" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"route_id" uuid NOT NULL,
	"stop_id" uuid NOT NULL,
	"sequence" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "route_stop" ADD CONSTRAINT "route_stop_route_id_route_id_fk" FOREIGN KEY ("route_id") REFERENCES "public"."route"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "route_stop" ADD CONSTRAINT "route_stop_stop_id_stop_id_fk" FOREIGN KEY ("stop_id") REFERENCES "public"."stop"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "route_stop_unique" ON "route_stop" USING btree ("route_id","stop_id");