import { pgTable, serial, text, integer, real, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const bookingsTable = pgTable("bookings", {
  id: serial("id").primaryKey(),
  bookingRef: text("booking_ref").notNull().unique(),
  userId: integer("user_id").notNull().default(1),
  movieId: integer("movie_id"),
  eventId: integer("event_id"),
  showtimeId: integer("showtime_id"),
  movieTitle: text("movie_title").notNull(),
  venue: text("venue").notNull(),
  date: text("date").notNull(),
  time: text("time").notNull(),
  format: text("format").notNull().default("2D"),
  seats: jsonb("seats").$type<string[]>().notNull().default([]),
  totalAmount: real("total_amount").notNull().default(0),
  convenienceFee: real("convenience_fee").notNull().default(0),
  status: text("status").notNull().default("confirmed"),
  userRating: integer("user_rating"),
  posterUrl: text("poster_url").notNull().default(""),
  posterGradient: text("poster_gradient").notNull().default("from-gray-800 to-gray-950"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertBookingSchema = createInsertSchema(bookingsTable).omit({ id: true, createdAt: true });
export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type Booking = typeof bookingsTable.$inferSelect;
