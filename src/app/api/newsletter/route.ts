import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { newsletterSubscribers } from "@/db/schema";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { initDb } from "@/lib/init-db";

export const runtime = "nodejs";

export async function POST(request: Request) {
  await initDb();
  const ip = getClientIp(request);
  const limited = rateLimit(`newsletter:${ip}`, 5, 60_000);
  if (!limited.ok) {
    return NextResponse.json({ error: "طلبات كثيرة" }, { status: 429 });
  }

  const { email } = (await request.json()) as { email?: string };
  if (!email?.includes("@")) {
    return NextResponse.json({ error: "البريد غير صالح" }, { status: 400 });
  }

  const existing = await db.query.newsletterSubscribers.findFirst({
    where: eq(newsletterSubscribers.email, email.toLowerCase()),
  });

  if (existing) {
    return NextResponse.json({ message: "مسجل مسبقاً" });
  }

  await db.insert(newsletterSubscribers).values({
    id: nanoid(),
    email: email.toLowerCase(),
    createdAt: new Date().toISOString(),
  });

  return NextResponse.json({ message: "تم التسجيل بنجاح" }, { status: 201 });
}
