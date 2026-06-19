import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import {
  getOrders,
  createOrder,
  type CreateOrderInput,
} from "@/lib/services/orders";
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
  const orders = await getOrders(status || undefined);
  return NextResponse.json(orders);
}

export async function POST(request: Request) {
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

  const order = await createOrder(body);
  return NextResponse.json(order, { status: 201 });
}
