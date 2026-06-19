import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { getDashboardStats } from "@/lib/services/orders";
import { initDb } from "@/lib/init-db";

export const runtime = "nodejs";

export async function GET() {
  await initDb();
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  const stats = await getDashboardStats();
  return NextResponse.json(stats);
}
