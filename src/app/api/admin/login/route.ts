import { NextResponse } from "next/server";
import { loginAdmin } from "@/lib/auth";
import { createSession, COOKIE_NAME, SESSION_MAX_AGE } from "@/lib/session";
import { generateCsrfToken, setCsrfCookie } from "@/lib/csrf";
import { initDb } from "@/lib/init-db";

export const runtime = "nodejs";

export async function POST(request: Request) {
  await initDb();
  const { username, password } = (await request.json()) as {
    username: string;
    password: string;
  };

  const session = await loginAdmin(username || "admin", password);
  if (!session) {
    return NextResponse.json({ error: "اسم المستخدم أو كلمة السر غالطة" }, { status: 401 });
  }

  const token = await createSession(session);
  const csrfToken = generateCsrfToken();
  await setCsrfCookie(csrfToken);

  const response = NextResponse.json({ success: true, username: session.username, csrfToken });
  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });

  return response;
}
