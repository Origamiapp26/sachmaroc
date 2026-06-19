import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import path from "path";

const DB_PATH =
  process.env.DATABASE_PATH || path.join(process.cwd(), "data", "sachmaroc.db");

export function runMigrations() {
  const conn = new Database(DB_PATH);
  conn.pragma("journal_mode = WAL");
  conn.pragma("foreign_keys = ON");
  migrate(drizzle(conn), {
    migrationsFolder: path.join(process.cwd(), "drizzle"),
  });
  conn.close();
}
