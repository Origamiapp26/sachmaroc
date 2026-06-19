import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import path from "path";
import * as schema from "./schema";

const DB_PATH =
  process.env.DATABASE_PATH || path.join(process.cwd(), "data", "sachmaroc.db");

const globalForDb = globalThis as unknown as {
  conn?: Database.Database;
  db?: ReturnType<typeof drizzle<typeof schema>>;
};

function getConnection() {
  if (!globalForDb.conn) {
    globalForDb.conn = new Database(DB_PATH);
    globalForDb.conn.pragma("journal_mode = WAL");
    globalForDb.conn.pragma("foreign_keys = ON");
  }
  return globalForDb.conn;
}

function getDb() {
  if (!globalForDb.db) {
    globalForDb.db = drizzle(getConnection(), { schema });
  }
  return globalForDb.db;
}

export const db = getDb();
