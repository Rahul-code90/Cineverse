import { db } from "@workspace/db";
import { sql } from "drizzle-orm";
import { logger } from "./logger";

/**
 * Initializes the SQLite database by creating all tables if they don't exist.
 * This runs at server startup for zero-config development.
 */
export async function initDatabase() {
  try {
    await db.run(sql`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        city TEXT NOT NULL DEFAULT 'Mumbai',
        cine_points INTEGER NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
      )
    `);

    await db.run(sql`
      CREATE TABLE IF NOT EXISTS movies (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        genre TEXT NOT NULL,
        rating REAL NOT NULL DEFAULT 0,
        votes INTEGER NOT NULL DEFAULT 0,
        runtime TEXT NOT NULL,
        certificate TEXT NOT NULL DEFAULT 'UA',
        languages TEXT NOT NULL DEFAULT '[]',
        badge TEXT NOT NULL DEFAULT '',
        synopsis TEXT NOT NULL DEFAULT '',
        director TEXT NOT NULL DEFAULT '',
        cast TEXT NOT NULL DEFAULT '[]',
        poster_url TEXT NOT NULL DEFAULT '',
        backdrop_url TEXT NOT NULL DEFAULT '',
        poster_gradient TEXT NOT NULL DEFAULT 'from-gray-800 to-gray-950',
        popularity INTEGER NOT NULL DEFAULT 50,
        is_active INTEGER NOT NULL DEFAULT 1
      )
    `);

    await db.run(sql`
      CREATE TABLE IF NOT EXISTS events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        date TEXT NOT NULL,
        venue TEXT NOT NULL,
        city TEXT NOT NULL DEFAULT 'Mumbai',
        price_from INTEGER NOT NULL DEFAULT 0,
        image_url TEXT NOT NULL DEFAULT '',
        image_gradient TEXT NOT NULL DEFAULT 'from-gray-800 to-gray-900',
        description TEXT NOT NULL DEFAULT '',
        total_tickets INTEGER NOT NULL DEFAULT 5000,
        available_tickets INTEGER NOT NULL DEFAULT 5000,
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
      )
    `);

    await db.run(sql`
      CREATE TABLE IF NOT EXISTS showtimes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        movie_id INTEGER NOT NULL,
        venue TEXT NOT NULL,
        date TEXT NOT NULL,
        time TEXT NOT NULL,
        format TEXT NOT NULL DEFAULT '2D',
        price REAL NOT NULL DEFAULT 200,
        total_seats INTEGER NOT NULL DEFAULT 200,
        available_seats INTEGER NOT NULL DEFAULT 200
      )
    `);

    await db.run(sql`
      CREATE TABLE IF NOT EXISTS bookings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        booking_ref TEXT NOT NULL UNIQUE,
        user_id INTEGER NOT NULL DEFAULT 1,
        movie_id INTEGER,
        event_id INTEGER,
        showtime_id INTEGER,
        movie_title TEXT NOT NULL,
        venue TEXT NOT NULL,
        date TEXT NOT NULL,
        time TEXT NOT NULL,
        format TEXT NOT NULL DEFAULT '2D',
        seats TEXT NOT NULL DEFAULT '[]',
        total_amount REAL NOT NULL DEFAULT 0,
        convenience_fee REAL NOT NULL DEFAULT 0,
        status TEXT NOT NULL DEFAULT 'confirmed',
        user_rating INTEGER,
        poster_url TEXT NOT NULL DEFAULT '',
        poster_gradient TEXT NOT NULL DEFAULT 'from-gray-800 to-gray-950',
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
      )
    `);

    logger.info("✅ Database initialized — all tables ready");
  } catch (err: any) {
    logger.error({ err }, "❌ Database initialization failed");
    throw err;
  }
}
