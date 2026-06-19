import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySession, COOKIE_NAME } from "@/lib/session";

const ADMIN_PATHS = ["/admin"];
const PROTECTED_API = ["/api/admin/stats", "/api/upload"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminPage =
    pathname.startsWith("/admin") && pathname !== "/admin/login";
  const isProtectedApi = PROTECTED_API.some((p) => pathname.startsWith(p));
  const isAdminMutation =
    (pathname.startsWith("/api/products") && request.method !== "GET") ||
    (pathname.startsWith("/api/categories") && request.method !== "GET") ||
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
  matcher: ["/admin/:path*", "/api/products/:path*", "/api/categories/:path*", "/api/orders/:path*", "/api/admin/stats", "/api/upload"],
};
