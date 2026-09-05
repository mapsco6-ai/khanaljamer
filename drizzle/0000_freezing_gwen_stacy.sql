CREATE TABLE "complaints" (
	"id" serial PRIMARY KEY NOT NULL,
	"reference" text NOT NULL,
	"type" text NOT NULL,
	"area" text NOT NULL,
	"message" text NOT NULL,
	"table_number" text,
	"rating" integer NOT NULL,
	"status" text DEFAULT 'new' NOT NULL,
	"manager_note" text DEFAULT '' NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "complaints_reference_unique" UNIQUE("reference")
);
--> statement-breakpoint
CREATE TABLE "custom_menu_items" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"category" text NOT NULL,
	"price" integer NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"image_key" text,
	"available" boolean DEFAULT true NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "menu_overrides" (
	"item_id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"price" integer NOT NULL,
	"image_key" text,
	"available" boolean DEFAULT true NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "offers" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"old_price" integer,
	"new_price" integer NOT NULL,
	"image_key" text,
	"starts_at" timestamp,
	"ends_at" timestamp,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
