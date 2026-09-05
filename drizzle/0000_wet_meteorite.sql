CREATE TABLE `complaints` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`reference` text NOT NULL,
	`type` text NOT NULL,
	`area` text NOT NULL,
	`message` text NOT NULL,
	`table_number` text,
	`rating` integer NOT NULL,
	`status` text DEFAULT 'new' NOT NULL,
	`manager_note` text DEFAULT '' NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `complaints_reference_unique` ON `complaints` (`reference`);--> statement-breakpoint
CREATE TABLE `menu_overrides` (
	`item_id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`price` integer NOT NULL,
	`available` integer DEFAULT true NOT NULL,
	`updated_at` integer NOT NULL
);
