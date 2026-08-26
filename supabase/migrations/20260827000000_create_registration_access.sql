create table if not exists public.registration_allowlist (
  id uuid primary key default gen_random_uuid(),
  phone text not null unique,
  name text,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.registration_attempts (
  id uuid primary key default gen_random_uuid(),
  phone text not null,
  name text,
  attempted_at timestamptz not null default timezone('utc', now())
);

alter table public.registration_allowlist enable row level security;
alter table public.registration_attempts enable row level security;

create index if not exists registration_allowlist_phone_idx on public.registration_allowlist (phone);
create index if not exists registration_attempts_phone_idx on public.registration_attempts (phone);
create index if not exists registration_attempts_name_idx on public.registration_attempts (name);

create policy "Only service role manages registration access"
  on public.registration_allowlist for all
  using (false) with check (false);

create policy "Only service role reads registration attempts"
  on public.registration_attempts for all
  using (false) with check (false);
