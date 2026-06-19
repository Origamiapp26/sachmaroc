import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { exportOrdersCsv } from "@/lib/services/orders";
import { initDb } from "@/lib/init-db";

export const runtime = "nodejs";

export async function GET() {
  await initDb();
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  const csv = await exportOrdersCsv();
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="sachmaroc-orders-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
