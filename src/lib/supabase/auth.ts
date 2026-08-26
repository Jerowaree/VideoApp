import { createClient } from "./browser";

export function normalizePhone(phone: string, countryCode = "+51") {
  const digits = phone.replace(/\D/g, "");
  const code = countryCode.replace(/\D/g, "");
  return digits.startsWith(code) ? `+${digits}` : `+${code}${digits}`;
}

export async function signInWithPhone(
  phone: string,
  password: string,
  countryCode: string,
) {
  const supabase = createClient();
  return supabase.auth.signInWithPassword({
    phone: normalizePhone(phone, countryCode),
    password,
  });
}

export async function signUpWithPhone(
  name: string,
  phone: string,
  password: string,
  countryCode: string,
) {
  const supabase = createClient();
  const normalizedPhone = normalizePhone(phone, countryCode);
  return supabase.auth.signUp({
    phone: normalizedPhone,
    password,
    options: { data: { name: name.trim() } },
  });
}

export async function upsertProfile(id: string, name: string, phone: string) {
  const supabase = createClient();
  return supabase
    .from("profiles")
    .upsert(
      { id, name: name.trim(), phone, is_active: true },
      { onConflict: "id" },
    );
}

export async function getMyProfile() {
  return createClient().from("profiles").select("is_active").single();
}
