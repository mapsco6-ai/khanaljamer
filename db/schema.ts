import { boolean, integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const menuOverrides = pgTable("menu_overrides", {
  itemId: text("item_id").primaryKey(),
  name: text("name").notNull(),
  price: integer("price").notNull(),
  imageKey: text("image_key"),
  available: boolean("available").notNull().default(true),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull(),
});

export const complaints = pgTable("complaints", {
  id: serial("id").primaryKey(),
  reference: text("reference").notNull().unique(),
  type: text("type").notNull(),
  area: text("area").notNull(),
  message: text("message").notNull(),
  tableNumber: text("table_number"),
  rating: integer("rating").notNull(),
  status: text("status").notNull().default("new"),
  managerNote: text("manager_note").notNull().default(""),
  createdAt: timestamp("created_at", { mode: "date" }).notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull(),
});

export const customMenuItems = pgTable("custom_menu_items", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  price: integer("price").notNull(),
  description: text("description").notNull().default(""),
  imageKey: text("image_key"),
  available: boolean("available").notNull().default(true),
  createdAt: timestamp("created_at", { mode: "date" }).notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull(),
});

export const offers = pgTable("offers", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull().default(""),
  oldPrice: integer("old_price"),
  newPrice: integer("new_price").notNull(),
  imageKey: text("image_key"),
  startsAt: timestamp("starts_at", { mode: "date" }),
  endsAt: timestamp("ends_at", { mode: "date" }),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at", { mode: "date" }).notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull(),
});
