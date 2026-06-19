import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { getOrderById, updateOrderStatus } from "@/lib/services/orders";
import type { OrderStatus } from "@/types/product";
import { initDb } from "@/lib/init-db";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  await initDb();
  const { id } = await context.params;
  const order = await getOrderById(id);
  if (!order) {
    return NextResponse.json({ error: "الطلب ما لقيناهش" }, { status: 404 });
  }
  return NextResponse.json(order);
}

export async function PATCH(request: Request, context: RouteContext) {
  await initDb();
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  const { id } = await context.params;
  const { status } = (await request.json()) as { status: OrderStatus };
  const order = await updateOrderStatus(id, status);
  if (!order) {
    return NextResponse.json({ error: "الطلب ما لقيناهش" }, { status: 404 });
  }
  return NextResponse.json(order);
}
