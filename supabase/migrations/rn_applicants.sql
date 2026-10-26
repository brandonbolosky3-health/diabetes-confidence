create table if not exists rn_applicants (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz not null default now(),
  first_name      text not null,
  last_name       text not null,
  phone           text not null,
  email           text not null,
  iv_experience   text not null,
  availability    text not null,
  zip             text not null,
  license_confirm boolean not null default false,
  contact_consent boolean not null default false
);

alter table rn_applicants enable row level security;
create policy "anon insert rn_applicants" on rn_applicants for insert to anon with check (true);
