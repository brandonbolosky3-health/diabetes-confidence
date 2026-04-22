-- Add consultation tracking columns to profiles table.
-- free_consultation_used_at: timestamp when Premium member confirmed their free Discovery Call booking.
-- practice_better_client_id: optional link to the corresponding Practice Better client record.
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS free_consultation_used_at timestamptz;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS practice_better_client_id text;
