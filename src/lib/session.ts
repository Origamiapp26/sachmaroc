import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const COOKIE_NAME = "sachmaroc_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

function getSecret() {
  const secret =
    process.env.AUTH_SECRET ||
    process.env.ADMIN_PASSWORD ||
    "sachmaroc-secret-change-me";
  return new TextEncoder().encode(secret);
}

export interface SessionPayload {
  adminId: string;
  username: string;
}

export async function createSession(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(getSecret());
}

export async function verifySession(
  token: string
): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySession(token);
}

export { COOKIE_NAME, SESSION_MAX_AGE };
