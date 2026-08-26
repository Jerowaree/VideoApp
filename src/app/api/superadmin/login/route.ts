import { NextResponse } from "next/server";
import { createSuperadminToken, sessionCookie } from "@/lib/superadmin-session";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const email =
    typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body?.password === "string" ? body.password : "";

  if (
    !process.env.SUPERADMIN_EMAIL ||
    !process.env.SUPERADMIN_PASSWORD ||
    !process.env.SUPERADMIN_SESSION_SECRET
  ) {
    return NextResponse.json(
      { error: "El panel no está configurado todavía." },
      { status: 503 },
    );
  }
  if (
    email !== process.env.SUPERADMIN_EMAIL.toLowerCase() ||
    password !== process.env.SUPERADMIN_PASSWORD
  ) {
    return NextResponse.json(
      { error: "Las credenciales no son válidas." },
      { status: 401 },
    );
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(sessionCookie(createSuperadminToken()));
  return response;
}
