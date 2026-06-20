import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySession, COOKIE_NAME } from "@/lib/session";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

const PROTECTED_API = [
  "/api/admin/stats",
  "/api/admin/analytics",
  "/api/admin/orders/export",
  "/api/admin/products/export",
  "/api/upload",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/api/admin/login" && request.method === "POST") {
    const ip = getClientIp(request);
    const limited = rateLimit(`login:${ip}`, 10, 15 * 60_000);
    if (!limited.ok) {
      return NextResponse.json({ error: "محاولات كثيرة، عاود بعد شوية" }, { status: 429 });
    }
  }

  if (pathname === "/api/orders" && request.method === "POST") {
    const ip = getClientIp(request);
    const limited = rateLimit(`order:${ip}`, 10, 60_000);
    if (!limited.ok) {
      return NextResponse.json({ error: "طلبات كثيرة" }, { status: 429 });
    }
  }

  const isAdminPage =
    pathname.startsWith("/admin") && pathname !== "/admin/login";
  const isProtectedApi = PROTECTED_API.some((p) => pathname.startsWith(p));
  const isAdminMutation =
    (pathname.startsWith("/api/products") && request.method !== "GET") ||
    (pathname.startsWith("/api/categories") && request.method !== "GET") ||
    (pathname.startsWith("/api/coupons") && request.method !== "GET") ||
    (pathname.startsWith("/api/settings") && request.method !== "GET") ||
    (pathname.startsWith("/api/orders") &&
      request.method !== "GET" &&
      request.method !== "POST") ||
    (pathname.match(/^\/api\/orders\/[^/]+$/) &&
      request.method !== "GET");

  if (!isAdminPage && !isProtectedApi && !isAdminMutation) {
    return NextResponse.next();
  }

  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  const session = await verifySession(token);
  if (!session) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "جلسة منتهية" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/products/:path*",
    "/api/categories/:path*",
    "/api/coupons/:path*",
    "/api/orders/:path*",
    "/api/admin/:path*",
    "/api/upload",
    "/api/settings",
  ],
};
