import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import {
  getOrders,
  createOrder,
  type CreateOrderInput,
} from "@/lib/services/orders";
import type { OrderStatus } from "@/types/product";
import { initDb } from "@/lib/init-db";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

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

  const orders = await getOrders({
    status: status || undefined,
    city,
    search,
  });
  return NextResponse.json(orders);
}

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const limited = rateLimit(`order:${ip}`, 10, 60_000);
  if (!limited.ok) {
    return NextResponse.json({ error: "طلبات كثيرة، عاود جرب" }, { status: 429 });
  }

  await initDb();

  const body = (await request.json()) as CreateOrderInput;

  if (
    !body.customerName ||
    !body.customerPhone ||
    !body.customerCity ||
    !body.customerAddress ||
    !body.items?.length
  ) {
    return NextResponse.json({ error: "معلومات ناقصة" }, { status: 400 });
  }

  try {
    const { order, sheets } = await createOrder(body);
    return NextResponse.json(
      {
        ...order,
        sheets: sheets
          ? {
              ok: sheets.ok,
              rowsWritten: sheets.rowsWritten,
              error: sheets.error,
              durationMs: sheets.durationMs,
            }
          : null,
      },
      { status: 201 }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "وقع خطأ فالطلب";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
