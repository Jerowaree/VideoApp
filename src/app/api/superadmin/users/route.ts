import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { hasSuperadminSession } from "@/lib/superadmin-session";

function normalizeAllowlistPhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  return digits ? `+${digits}` : "";
}

export async function GET(request: Request) {
  if (!(await hasSuperadminSession()))
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  const url = new URL(request.url);
  const page = Math.max(1, Number(url.searchParams.get("page") || 1));
  const pageSize = Math.min(
    25,
    Math.max(1, Number(url.searchParams.get("pageSize") || 8)),
  );
  const query = (url.searchParams.get("q")?.trim() || "").replace(/[(),]/g, "");
  let allowlistQuery = createAdminClient()
    .from("registration_allowlist")
    .select("id, name, phone, is_active, created_at", { count: "exact" })
    .eq("is_active", true)
    .order("created_at", { ascending: false });
  if (query)
    allowlistQuery = allowlistQuery.or(
      `phone.ilike.%${query}%,name.ilike.%${query}%`,
    );
  const { data, error, count } = await allowlistQuery.range(
    (page - 1) * pageSize,
    page * pageSize - 1,
  );
  if (error)
    return NextResponse.json(
      { error: "No pudimos cargar los números autorizados." },
      { status: 500 },
    );
  const phones = (data || []).map((item) => item.phone);
  const { data: profiles } = phones.length
    ? await createAdminClient()
        .from("profiles")
        .select("phone, name")
        .in("phone", phones)
    : { data: [] };
  const names = new Map(
    (profiles || []).map((profile) => [profile.phone, profile.name]),
  );
  return NextResponse.json({
    users: (data || []).map((item) => ({
      ...item,
      name: names.get(item.phone) || item.name || "Sin nombre",
    })),
    total: count || 0,
    page,
    pageSize,
  });
}

export async function PATCH(request: Request) {
  if (!(await hasSuperadminSession()))
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  const body = await request.json().catch(() => null);
  const id = typeof body?.id === "string" ? body.id : "";
  const phone =
    typeof body?.phone === "string" ? normalizeAllowlistPhone(body.phone) : "";
  const name = typeof body?.name === "string" ? body.name.trim() : null;
  if (!id)
    return NextResponse.json(
      { error: "Usuario autorizado inválido." },
      { status: 400 },
    );
  if (!/^\+\d{8,15}$/.test(phone))
    return NextResponse.json(
      { error: "Número de autorización inválido." },
      { status: 400 },
    );
  const { error } = await createAdminClient()
    .from("registration_allowlist")
    .update({
      phone,
      name,
      is_active: true,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);
  if (error)
    return NextResponse.json(
      { error: "No pudimos actualizar el número autorizado." },
      { status: 500 },
    );
  return NextResponse.json({ ok: true });
}

export async function POST(request: Request) {
  if (!(await hasSuperadminSession()))
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  const body = await request.json().catch(() => null);
  const phone =
    typeof body?.phone === "string" ? normalizeAllowlistPhone(body.phone) : "";
  const name = typeof body?.name === "string" ? body.name.trim() : null;
  if (!/^\+\d{8,15}$/.test(phone))
    return NextResponse.json(
      { error: "Ingresa un número válido con código de país." },
      { status: 400 },
    );
  const { error } = await createAdminClient()
    .from("registration_allowlist")
    .upsert(
      { phone, name, is_active: true, updated_at: new Date().toISOString() },
      { onConflict: "phone" },
    );
  if (error)
    return NextResponse.json(
      { error: "No pudimos autorizar el número." },
      { status: 500 },
    );
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  if (!(await hasSuperadminSession()))
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  const body = await request.json().catch(() => null);
  const id = typeof body?.id === "string" ? body.id : "";
  if (!id)
    return NextResponse.json(
      { error: "Usuario autorizado inválido." },
      { status: 400 },
    );

  const { error } = await createAdminClient()
    .from("registration_allowlist")
    .delete()
    .eq("id", id);
  if (error)
    return NextResponse.json(
      { error: "No pudimos eliminar el número autorizado." },
      { status: 500 },
    );

  return NextResponse.json({ ok: true });
}
