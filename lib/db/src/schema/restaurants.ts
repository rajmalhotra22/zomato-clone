import { pgTable, text, serial, boolean, integer, real, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const restaurantsTable = pgTable("restaurants", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  cuisine: text("cuisine").notNull(),
  rating: real("rating").notNull().default(4.0),
  reviewCount: integer("review_count").notNull().default(0),
  deliveryTime: integer("delivery_time").notNull().default(30),
  deliveryFee: real("delivery_fee").notNull().default(30),
  minimumOrder: real("minimum_order").notNull().default(100),
  imageUrl: text("image_url").notNull(),
  isVeg: boolean("is_veg").notNull().default(false),
  isOpen: boolean("is_open").notNull().default(true),
  discount: text("discount"),
  address: text("address").notNull(),
  priceForTwo: real("price_for_two").notNull().default(400),
  isFeatured: boolean("is_featured").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertRestaurantSchema = createInsertSchema(restaurantsTable).omit({ id: true, createdAt: true });
export type InsertRestaurant = z.infer<typeof insertRestaurantSchema>;
export type Restaurant = typeof restaurantsTable.$inferSelect;
