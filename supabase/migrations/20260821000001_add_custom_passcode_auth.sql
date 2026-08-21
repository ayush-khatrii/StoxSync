create table if not exists public.app_users (
  id uuid primary key default gen_random_uuid(),
  passcode_hash text not null,
  passcode_lookup text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.app_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.app_users(id) on delete cascade,
  token_hash text not null unique,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

create index if not exists app_sessions_token_hash_idx on public.app_sessions (token_hash);
create index if not exists app_sessions_expires_at_idx on public.app_sessions (expires_at);

alter table public.ipos add column if not exists user_id uuid references public.app_users(id) on delete cascade;
alter table public.ipos drop column if exists issue_size;
create index if not exists ipos_user_id_idx on public.ipos (user_id);

drop policy if exists "Public can read IPOs" on public.ipos;
drop policy if exists "Public can create IPOs" on public.ipos;
drop policy if exists "Public can update IPOs" on public.ipos;
drop policy if exists "Public can delete IPOs" on public.ipos;
alter table public.ipos enable row level security;

drop policy if exists "Service role manages user IPOs" on public.ipos;
create policy "Service role manages user IPOs"
  on public.ipos for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

create table if not exists public.ipo_applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.app_users(id) on delete cascade,
  company text not null,
  symbol text not null,
  initials text not null,
  application_date date not null,
  offer_date text not null,
  offer_start date not null,
  offer_end date not null,
  offer_price text not null,
  cut_off_price numeric(12, 2) not null check (cut_off_price > 0),
  lot_size integer not null check (lot_size > 0),
  lots integer not null check (lots > 0),
  total numeric(14, 2) not null check (total >= 0),
  applicant text not null,
  status text not null default 'Tracked',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint ipo_applications_offer_dates_valid check (offer_end >= offer_start)
);

create index if not exists ipo_applications_user_id_idx on public.ipo_applications (user_id);

alter table public.app_users enable row level security;
alter table public.app_sessions enable row level security;
alter table public.ipo_applications enable row level security;

drop policy if exists "Service role manages user applications" on public.ipo_applications;
create policy "Service role manages user applications"
  on public.ipo_applications for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');
