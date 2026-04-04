import { pgTable, serial, text, real, integer, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const moviesTable = pgTable("movies", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  genre: text("genre").notNull(),
  rating: real("rating").notNull().default(0),
  votes: integer("votes").notNull().default(0),
  runtime: text("runtime").notNull(),
  certificate: text("certificate").notNull().default("UA"),
  languages: jsonb("languages").$type<string[]>().notNull().default([]),
  badge: text("badge").notNull().default(""),
  synopsis: text("synopsis").notNull().default(""),
  director: text("director").notNull().default(""),
  cast: jsonb("cast").$type<{ name: string; role: string; color: string }[]>().notNull().default([]),
  posterUrl: text("poster_url").notNull().default(""),
  backdropUrl: text("backdrop_url").notNull().default(""),
  posterGradient: text("poster_gradient").notNull().default("from-gray-800 to-gray-950"),
  popularity: integer("popularity").notNull().default(50),
  isActive: integer("is_active").notNull().default(1),
});

export const insertMovieSchema = createInsertSchema(moviesTable).omit({ id: true });
export type InsertMovie = z.infer<typeof insertMovieSchema>;
export type Movie = typeof moviesTable.$inferSelect;
