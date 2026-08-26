import { NextResponse } from "next/server";
import { expiredSessionCookie } from "@/lib/superadmin-session";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(expiredSessionCookie());
  return response;
}
