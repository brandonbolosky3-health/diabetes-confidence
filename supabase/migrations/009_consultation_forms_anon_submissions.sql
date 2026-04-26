-- Allow anonymous (un-authenticated) consultation-form submissions so the
-- form linked from the pre-consultation reminder email works for free-
-- consultation leads who don't have an account. Authenticated members
-- still attach their member_id; anon submissions identify themselves by
-- the email column instead.

ALTER TABLE consultation_forms
  ALTER COLUMN member_id DROP NOT NULL;

ALTER TABLE consultation_forms
  ADD COLUMN IF NOT EXISTS created_at timestamptz NOT NULL DEFAULT now();

CREATE INDEX IF NOT EXISTS consultation_forms_email_idx
  ON consultation_forms(email);

CREATE INDEX IF NOT EXISTS consultation_forms_created_at_idx
  ON consultation_forms(created_at DESC);

-- Inserts from the public form go through the service-role key (bypasses
-- RLS), but we still add a permissive insert policy for anon clients in
-- case the route is ever switched to the anon key.
DROP POLICY IF EXISTS "Allow public insert" ON consultation_forms;
CREATE POLICY "Allow public insert" ON consultation_forms
  FOR INSERT TO anon, authenticated
  WITH CHECK (member_id IS NULL OR auth.uid() = member_id);
