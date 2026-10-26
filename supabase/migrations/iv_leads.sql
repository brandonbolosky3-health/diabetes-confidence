-- iv_leads: captures IV hydration appointment requests from /iv
-- Run this in the Supabase SQL editor or via supabase db push.

create table if not exists iv_leads (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  first_name  text not null,
  phone       text not null,
  email       text not null,
  zip         text not null,
  drip        text not null,
  timing      text not null,
  source      text not null,
  consent     boolean not null default false
);

-- RLS: allow anonymous INSERT only; no SELECT/UPDATE/DELETE for anon users.
alter table iv_leads enable row level security;

create policy "anon insert iv_leads"
  on iv_leads
  for insert
  to anon
  with check (true);
