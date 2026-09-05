import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const menuOverrides = sqliteTable("menu_overrides", {
  itemId: text("item_id").primaryKey(),
  name: text("name").notNull(),
  price: integer("price").notNull(),
  imageKey: text("image_key"),
  available: integer("available", { mode: "boolean" }).notNull().default(true),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
});

export const complaints = sqliteTable("complaints", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  reference: text("reference").notNull().unique(),
  type: text("type").notNull(),
  area: text("area").notNull(),
  message: text("message").notNull(),
  tableNumber: text("table_number"),
  rating: integer("rating").notNull(),
  status: text("status").notNull().default("new"),
  managerNote: text("manager_note").notNull().default(""),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
});

export const customMenuItems = sqliteTable("custom_menu_items", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  price: integer("price").notNull(),
  description: text("description").notNull().default(""),
  imageKey: text("image_key"),
  available: integer("available", { mode: "boolean" }).notNull().default(true),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
});

export const offers = sqliteTable("offers", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull().default(""),
  oldPrice: integer("old_price"),
  newPrice: integer("new_price").notNull(),
  imageKey: text("image_key"),
  startsAt: integer("starts_at", { mode: "timestamp_ms" }),
  endsAt: integer("ends_at", { mode: "timestamp_ms" }),
  active: integer("active", { mode: "boolean" }).notNull().default(true),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
});
