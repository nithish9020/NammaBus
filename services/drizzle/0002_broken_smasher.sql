CREATE TYPE "public"."staff_status" AS ENUM('active', 'inactive', 'suspended');--> statement-breakpoint
CREATE TABLE "conductor" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"badge_number" text NOT NULL,
	"phone" text NOT NULL,
	"city" text NOT NULL,
	"status" "staff_status" DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "conductor_badge_number_unique" UNIQUE("badge_number")
);
--> statement-breakpoint
CREATE TABLE "driver" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"license_number" text NOT NULL,
	"phone" text NOT NULL,
	"city" text NOT NULL,
	"status" "staff_status" DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "driver_license_number_unique" UNIQUE("license_number")
);
--> statement-breakpoint
ALTER TABLE "conductor" ADD CONSTRAINT "conductor_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "driver" ADD CONSTRAINT "driver_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;