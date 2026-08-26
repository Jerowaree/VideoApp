import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "superadmin_session";
const SESSION_TTL = 60 * 60 * 8;

function secret() {
  const value = process.env.SUPERADMIN_SESSION_SECRET;
  if (!value) throw new Error("SUPERADMIN_SESSION_SECRET is not configured");
  return value;
}

function sign(value: string) {
  return createHmac("sha256", secret()).update(value).digest("base64url");
}

export function createSuperadminToken() {
  const payload = `${process.env.SUPERADMIN_EMAIL}:${Date.now()}`;
  return `${payload}:${sign(payload)}`;
}

export function isValidSuperadminToken(token: string | undefined) {
  if (!token) return false;
  const [email, timestamp, signature] = token.split(":");
  if (
    !email ||
    !timestamp ||
    !signature ||
    email !== process.env.SUPERADMIN_EMAIL
  )
    return false;
  const payload = `${email}:${timestamp}`;
  const expected = sign(payload);
  if (
    signature.length !== expected.length ||
    !timingSafeEqual(Buffer.from(signature), Buffer.from(expected))
  )
    return false;
  return Date.now() - Number(timestamp) < SESSION_TTL * 1000;
}

export async function hasSuperadminSession() {
  return isValidSuperadminToken((await cookies()).get(COOKIE_NAME)?.value);
}

export function sessionCookie(token: string) {
  return {
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    sameSite: "strict" as const,
    secure: process.env.NODE_ENV === "production",
    maxAge: SESSION_TTL,
    path: "/",
  };
}

export function expiredSessionCookie() {
  return {
    name: COOKIE_NAME,
    value: "",
    httpOnly: true,
    sameSite: "strict" as const,
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
    path: "/",
  };
}

export { COOKIE_NAME };
