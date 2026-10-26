-- Add coaching interest flag to iv_leads
alter table iv_leads
  add column if not exists coaching_interest boolean not null default false;
