import { sqliteTable, integer, text, real } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const moviesTable = sqliteTable("movies", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  genre: text("genre").notNull(),
  rating: real("rating").notNull().default(0),
  votes: integer("votes").notNull().default(0),
  runtime: text("runtime").notNull(),
  certificate: text("certificate").notNull().default("UA"),
  // SQLite doesn't support jsonb — store as TEXT JSON
  languages: text("languages").notNull().default("[]"),
  badge: text("badge").notNull().default(""),
  synopsis: text("synopsis").notNull().default(""),
  director: text("director").notNull().default(""),
  cast: text("cast").notNull().default("[]"),
  posterUrl: text("poster_url").notNull().default(""),
  backdropUrl: text("backdrop_url").notNull().default(""),
  posterGradient: text("poster_gradient").notNull().default("from-gray-800 to-gray-950"),
  popularity: integer("popularity").notNull().default(50),
  trailerUrl: text("trailer_url").notNull().default(""),
  isActive: integer("is_active").notNull().default(1),
});

export const insertMovieSchema = createInsertSchema(moviesTable).omit({ id: true });
export type InsertMovie = z.infer<typeof insertMovieSchema>;
export type Movie = typeof moviesTable.$inferSelect;
