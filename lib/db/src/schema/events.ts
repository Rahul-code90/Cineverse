import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const eventsTable = sqliteTable("events", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  category: text("category").notNull(),
  date: text("date").notNull(),
  venue: text("venue").notNull(),
  city: text("city").notNull().default("Mumbai"),
  priceFrom: integer("price_from").notNull().default(0),
  imageUrl: text("image_url").notNull().default(""),
  imageGradient: text("image_gradient").notNull().default("from-gray-800 to-gray-900"),
  description: text("description").notNull().default(""),
  totalTickets: integer("total_tickets").notNull().default(5000),
  availableTickets: integer("available_tickets").notNull().default(5000),
  isHot: integer("is_hot").notNull().default(0),
  createdAt: text("created_at").notNull().default(new Date().toISOString()),
});

export const insertEventSchema = createInsertSchema(eventsTable).omit({ id: true, createdAt: true });
export type InsertEvent = z.infer<typeof insertEventSchema>;
export type Event = typeof eventsTable.$inferSelect;
