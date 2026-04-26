-- Stores submissions from the /cookbook download form. Public-insert,
-- no read policy beyond admins (handled separately) — emails are sent
-- via the Resend transactional email helper, not read back from here.
CREATE TABLE IF NOT EXISTS cookbook_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  first_name TEXT NOT NULL,
  email TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS cookbook_requests_email_idx ON cookbook_requests(email);
CREATE INDEX IF NOT EXISTS cookbook_requests_created_at_idx ON cookbook_requests(created_at DESC);

ALTER TABLE cookbook_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public insert" ON cookbook_requests;
CREATE POLICY "Allow public insert" ON cookbook_requests
  FOR INSERT TO anon, authenticated WITH CHECK (true);
