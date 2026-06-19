import { NextResponse } from "next/server";
import { updateCoupon, deleteCoupon } from "@/lib/coupons";
import { isAdminAuthenticated } from "@/lib/auth";
import type { Coupon } from "@/types/settings";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ code: string }> };

export async function PUT(request: Request, context: RouteContext) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  const { code } = await context.params;
  const body = (await request.json()) as Partial<Coupon>;
  const coupon = updateCoupon(code, body);
  if (!coupon) {
    return NextResponse.json({ error: "الكوبون ما لقيناهش" }, { status: 404 });
  }
  return NextResponse.json(coupon);
}

export async function DELETE(_request: Request, context: RouteContext) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  const { code } = await context.params;
  const deleted = deleteCoupon(code);
  if (!deleted) {
    return NextResponse.json({ error: "الكوبون ما لقيناهش" }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
