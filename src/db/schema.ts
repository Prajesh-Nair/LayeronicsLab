import { integer, jsonb, pgTable, real, text, timestamp } from "drizzle-orm/pg-core";

export const products = pgTable("products", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: real("price").notNull(),
  /** MRP / list price — shown struck through when greater than `price`. */
  originalPrice: real("original_price"),
  image: text("image").notNull(),
  images: jsonb("images").$type<string[]>().notNull().default([]),
  colors: jsonb("colors").$type<string[]>().notNull(),
  tag: text("tag"),
  /** e.g. "12 × 10 × 8 cm" */
  dimensions: text("dimensions"),
  /** e.g. "85 g" */
  weight: text("weight"),
  category: text("category").notNull().default("useful-items"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const orders = pgTable("orders", {
  id: text("id").primaryKey(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  pincode: text("pincode"),
  notes: text("notes").notNull().default(""),
  total: real("total").notNull(),
  status: text("status").notNull().default("new"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const orderItems = pgTable("order_items", {
  id: text("id").primaryKey(),
  orderId: text("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  productId: text("product_id").notNull(),
  name: text("name").notNull(),
  price: real("price").notNull(),
  image: text("image").notNull(),
  color: text("color").notNull(),
  quantity: integer("quantity").notNull(),
});

export type DbProduct = typeof products.$inferSelect;
export type DbOrder = typeof orders.$inferSelect;
export type DbOrderItem = typeof orderItems.$inferSelect;
