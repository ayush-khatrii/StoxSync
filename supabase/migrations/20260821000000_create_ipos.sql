create table if not exists public.ipos (
  id uuid primary key default gen_random_uuid(),
  company text not null,
  symbol text not null,
  initials text not null,
  offer_start date not null,
  offer_end date not null,
  offer_price text not null,
  cut_off_price numeric(12, 2) not null check (cut_off_price > 0),
  lot_size integer not null check (lot_size > 0),
  issue_size text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint ipos_offer_dates_valid check (offer_end >= offer_start)
);

create index if not exists ipos_created_at_idx on public.ipos (created_at desc);

alter table public.ipos enable row level security;

grant select, insert, update, delete on table public.ipos to anon, authenticated;

create policy "Public can read IPOs"
  on public.ipos for select
  to anon, authenticated
  using (true);

create policy "Public can create IPOs"
  on public.ipos for insert
  to anon, authenticated
  with check (true);

create policy "Public can update IPOs"
  on public.ipos for update
  to anon, authenticated
  using (true)
  with check (true);

create policy "Public can delete IPOs"
  on public.ipos for delete
  to anon, authenticated
  using (true);
