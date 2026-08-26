import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { hasSuperadminSession } from "@/lib/superadmin-session";

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
  let attemptsQuery = createAdminClient()
    .from("registration_attempts")
    .select("id, name, phone, attempted_at", { count: "exact" })
    .order("attempted_at", { ascending: false });
  if (query)
    attemptsQuery = attemptsQuery.or(
      `phone.ilike.%${query}%,name.ilike.%${query}%`,
    );
  const { data, error, count } = await attemptsQuery.range(
    (page - 1) * pageSize,
    page * pageSize - 1,
  );
  if (error)
    return NextResponse.json(
      { error: "No pudimos cargar los intentos." },
      { status: 500 },
    );
  return NextResponse.json({
    attempts: data || [],
    total: count || 0,
    page,
    pageSize,
  });
}
