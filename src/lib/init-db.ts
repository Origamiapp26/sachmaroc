import { runMigrations } from "@/db/migrate";
import { db } from "@/db";

let initialized = false;

export async function initDb() {
  if (initialized) return;
  runMigrations();

  const admin = await db.query.admins.findFirst();
  const product = await db.query.products.findFirst();

  if (!admin || !product) {
    const { runSeed } = await import("@/db/seed");
    await runSeed();
  }

  initialized = true;
}
