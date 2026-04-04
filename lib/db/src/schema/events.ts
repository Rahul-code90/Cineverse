import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const eventsTable = pgTable("events", {
  id: serial("id").primaryKey(),
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
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertEventSchema = createInsertSchema(eventsTable).omit({ id: true, createdAt: true });
export type InsertEvent = z.infer<typeof insertEventSchema>;
export type Event = typeof eventsTable.$inferSelect;
