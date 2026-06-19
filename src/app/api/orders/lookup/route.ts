import { NextResponse } from "next/server";
import { getOrderByNumber, getOrdersByPhone } from "@/lib/services/orders";
import { initDb } from "@/lib/init-db";

export const runtime = "nodejs";

export async function GET(request: Request) {
  await initDb();
  const { searchParams } = new URL(request.url);
  const orderNumber = searchParams.get("orderNumber");
  const phone = searchParams.get("phone");

  if (orderNumber) {
    const order = await getOrderByNumber(orderNumber);
    if (!order) {
      return NextResponse.json({ error: "الطلب ما لقيناهش" }, { status: 404 });
    }
    return NextResponse.json(order);
  }

  if (phone) {
    const orders = await getOrdersByPhone(phone);
    return NextResponse.json(orders);
  }

  return NextResponse.json({ error: "عطينا رقم الطلب أو الهاتف" }, { status: 400 });
}
