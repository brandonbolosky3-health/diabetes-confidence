-- Add consent timestamp column to iv_leads
alter table iv_leads
  add column if not exists consent_at timestamptz;
