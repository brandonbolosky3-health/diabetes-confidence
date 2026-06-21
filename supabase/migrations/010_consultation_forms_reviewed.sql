-- Add reviewed flag so admin can archive seen consultation submissions
ALTER TABLE consultation_forms ADD COLUMN IF NOT EXISTS reviewed boolean DEFAULT false;
CREATE INDEX IF NOT EXISTS idx_consultation_forms_reviewed ON consultation_forms(reviewed);
