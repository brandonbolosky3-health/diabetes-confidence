-- Stores submissions from the public free-consultation intake form on
-- /consultation. RLS allows anonymous inserts (it's a public form) but
-- restricts reads to admins and the row's own user_id, so individual
-- members cannot see others' intakes.
CREATE TABLE IF NOT EXISTS consultation_intakes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  health_goals TEXT NOT NULL,
  quiz_answers JSONB,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS consultation_intakes_email_idx ON consultation_intakes(email);
CREATE INDEX IF NOT EXISTS consultation_intakes_created_at_idx ON consultation_intakes(created_at DESC);

ALTER TABLE consultation_intakes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public insert" ON consultation_intakes;
CREATE POLICY "Allow public insert" ON consultation_intakes
  FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Allow admin read" ON consultation_intakes;
CREATE POLICY "Allow admin read" ON consultation_intakes
  FOR SELECT TO authenticated USING (
    auth.jwt() ->> 'role' = 'admin' OR auth.uid() = user_id
  );
