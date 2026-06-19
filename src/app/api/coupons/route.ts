import { NextResponse } from "next/server";
import { getCoupons, createCoupon, validateCoupon } from "@/lib/coupons";
import { isAdminAuthenticated } from "@/lib/auth";
import type { Coupon } from "@/types/settings";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }
  return NextResponse.json(getCoupons());
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as Coupon;
    const coupon = createCoupon(body);
    return NextResponse.json(coupon, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "وقع خطأ" },
      { status: 400 }
    );
  }
}
