import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { normalizePhone } from "@/lib/supabase/auth";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const phone = typeof body?.phone === "string" ? body.phone : "";
  const countryCode =
    typeof body?.countryCode === "string" ? body.countryCode : "+51";
  const name = typeof body?.name === "string" ? body.name.trim() : null;
  const normalizedPhone = normalizePhone(phone, countryCode);
  if (!/^\+\d{8,15}$/.test(normalizedPhone))
    return NextResponse.json(
      { error: "Número de celular inválido." },
      { status: 400 },
    );

  const admin = createAdminClient();
  const { data: allowed, error } = await admin
    .from("registration_allowlist")
    .select("phone")
    .eq("phone", normalizedPhone)
    .eq("is_active", true)
    .maybeSingle();
  if (error)
    return NextResponse.json(
      { error: "No pudimos verificar la invitación." },
      { status: 500 },
    );
  if (!allowed) {
    const attempt = await admin
      .from("registration_attempts")
      .insert({ phone: normalizedPhone, name });
    if (attempt.error)
      return NextResponse.json(
        { error: "No pudimos registrar el intento. Inténtalo nuevamente." },
        { status: 500 },
      );
    return NextResponse.json(
      { error: "Este número necesita una invitación para registrarse." },
      { status: 403 },
    );
  }
  return NextResponse.json({ authorized: true });
}
