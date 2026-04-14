import { sqliteTable, integer, text, real } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const showtimesTable = sqliteTable("showtimes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  movieId: integer("movie_id").notNull(),
  venue: text("venue").notNull(),
  date: text("date").notNull(),
  time: text("time").notNull(),
  format: text("format").notNull().default("2D"),
  price: real("price").notNull().default(200),
  totalSeats: integer("total_seats").notNull().default(200),
  availableSeats: integer("available_seats").notNull().default(200),
});

export const insertShowtimeSchema = createInsertSchema(showtimesTable).omit({ id: true });
export type InsertShowtime = z.infer<typeof insertShowtimeSchema>;
export type Showtime = typeof showtimesTable.$inferSelect;
