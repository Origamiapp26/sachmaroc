import { NextResponse } from "next/server";
import { validateCoupon } from "@/lib/coupons";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const limited = rateLimit(`coupon:${ip}`, 20, 60_000);
  if (!limited.ok) {
    return NextResponse.json({ error: "طلبات كثيرة، عاود جرب" }, { status: 429 });
  }

  const { code, subtotal } = (await request.json()) as {
    code: string;
    subtotal: number;
  };

  const result = validateCoupon(code, subtotal);
  if (!result.valid) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({
    discount: result.discount,
    code: result.coupon.code,
  });
}
