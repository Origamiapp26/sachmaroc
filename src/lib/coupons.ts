import { readFileSync, writeFileSync, renameSync } from "fs";
import path from "path";
import { unstable_noStore as noStore } from "next/cache";
import type { Coupon } from "@/types/settings";

const COUPONS_FILE = path.join(process.cwd(), "data", "coupons.json");

function readCouponsFile(): Coupon[] {
  noStore();
  try {
    const raw = readFileSync(COUPONS_FILE, "utf-8");
    return JSON.parse(raw) as Coupon[];
  } catch {
    return [];
  }
}

function writeCouponsFile(coupons: Coupon[]): void {
  const content = `${JSON.stringify(coupons, null, 2)}\n`;
  const tmp = `${COUPONS_FILE}.tmp`;
  writeFileSync(tmp, content, "utf-8");
  renameSync(tmp, COUPONS_FILE);
}

export function getCoupons(): Coupon[] {
  return readCouponsFile();
}

export function getCouponByCode(code: string): Coupon | undefined {
  return getCoupons().find((c) => c.code.toUpperCase() === code.toUpperCase());
}

export function validateCoupon(
  code: string,
  subtotal: number
): { valid: true; discount: number; coupon: Coupon } | { valid: false; error: string } {
  const coupon = getCouponByCode(code);
  if (!coupon) return { valid: false, error: "كود الخصم غير صالح" };
  if (!coupon.active) return { valid: false, error: "كود الخصم غير نشط" };
  if (new Date(coupon.expiresAt) < new Date()) {
    return { valid: false, error: "كود الخصم منتهي الصلاحية" };
  }
  if (subtotal < coupon.minOrder) {
    return { valid: false, error: `الحد الأدنى للطلب ${coupon.minOrder} درهم` };
  }

  const discount =
    coupon.type === "percent"
      ? Math.round(subtotal * (coupon.value / 100))
      : Math.min(coupon.value, subtotal);

  return { valid: true, discount, coupon };
}

export function createCoupon(coupon: Coupon): Coupon {
  const coupons = getCoupons();
  if (coupons.some((c) => c.code.toUpperCase() === coupon.code.toUpperCase())) {
    throw new Error("كود الخصم موجود مسبقاً");
  }
  writeCouponsFile([...coupons, { ...coupon, code: coupon.code.toUpperCase() }]);
  return coupon;
}

export function updateCoupon(code: string, data: Partial<Coupon>): Coupon | null {
  const coupons = getCoupons();
  const index = coupons.findIndex((c) => c.code.toUpperCase() === code.toUpperCase());
  if (index === -1) return null;
  coupons[index] = { ...coupons[index], ...data };
  writeCouponsFile(coupons);
  return coupons[index];
}

export function deleteCoupon(code: string): boolean {
  const coupons = getCoupons();
  const filtered = coupons.filter((c) => c.code.toUpperCase() !== code.toUpperCase());
  if (filtered.length === coupons.length) return false;
  writeCouponsFile(filtered);
  return true;
}
