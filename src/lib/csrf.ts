import { randomBytes } from "crypto";
import { cookies } from "next/headers";

export const CSRF_COOKIE = "sachmaroc_csrf";
const CSRF_HEADER = "x-csrf-token";

export function generateCsrfToken(): string {
  return randomBytes(32).toString("hex");
}

export async function setCsrfCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(CSRF_COOKIE, token, {
    httpOnly: false,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function validateCsrf(request: Request): Promise<boolean> {
  const header = request.headers.get(CSRF_HEADER);
  const cookieStore = await cookies();
  const cookie = cookieStore.get(CSRF_COOKIE)?.value;
  if (!header || !cookie) return false;
  return header === cookie;
}

export { CSRF_HEADER };
