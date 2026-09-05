CREATE TABLE `custom_menu_items` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`category` text NOT NULL,
	`price` integer NOT NULL,
	`description` text DEFAULT '' NOT NULL,
	`image_key` text,
	`available` integer DEFAULT true NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `offers` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`description` text DEFAULT '' NOT NULL,
	`old_price` integer,
	`new_price` integer NOT NULL,
	`image_key` text,
	`starts_at` integer,
	`ends_at` integer,
	`active` integer DEFAULT true NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
