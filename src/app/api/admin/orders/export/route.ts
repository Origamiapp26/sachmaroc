import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { exportOrdersCsv } from "@/lib/services/orders";
import type { OrderStatus } from "@/types/product";
import { initDb } from "@/lib/init-db";

export const runtime = "nodejs";

export async function GET(request: Request) {
  await initDb();
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") as OrderStatus | null;
  const city = searchParams.get("city") || undefined;
  const search = searchParams.get("search") || undefined;

  const csv = await exportOrdersCsv({
    status: status || undefined,
    city,
    search,
  });

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="sachmaroc-orders-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
