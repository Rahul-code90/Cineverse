import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import * as schema from "./schema";

// Resolve the DB file path relative to this file's location
const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Place the SQLite DB file in the lib/db directory
const dbPath = process.env.DATABASE_PATH ?? path.resolve(__dirname, "../../../cineverse.db");
console.log(`[DB] Initializing SQLite database at: ${dbPath}`);

const sqlite = new Database(dbPath);

// Enable WAL mode for better concurrent read performance
sqlite.pragma("journal_mode = WAL");
sqlite.pragma("foreign_keys = ON");

export const db = drizzle(sqlite, { schema });

export * from "./schema";
