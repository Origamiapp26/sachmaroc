import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { getSession, type SessionPayload } from "@/lib/session";

export type { SessionPayload };

async function getDb() {
  const { db } = await import("@/db");
  return db;
}

async function getAdminsSchema() {
  const { admins } = await import("@/db/schema");
  return admins;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const session = await getSession();
  if (!session) return false;
  const db = await getDb();
  const admins = await getAdminsSchema();
  const admin = await db.query.admins.findFirst({
    where: eq(admins.id, session.adminId),
  });
  return !!admin;
}

export async function loginAdmin(
  username: string,
  password: string
): Promise<SessionPayload | null> {
  const db = await getDb();
  const admins = await getAdminsSchema();
  const admin = await db.query.admins.findFirst({
    where: eq(admins.username, username),
  });
  if (!admin) return null;
  const valid = await verifyPassword(password, admin.passwordHash);
  if (!valid) return null;
  return { adminId: admin.id, username: admin.username };
}

export { getSession, createSession } from "@/lib/session";
export { COOKIE_NAME, SESSION_MAX_AGE } from "@/lib/session";
