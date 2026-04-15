-- Ensure member_profiles table exists with all required columns
CREATE TABLE IF NOT EXISTS member_profiles (
  user_id uuid PRIMARY KEY,
  primary_goal text,
  biggest_challenge text,
  diagnoses text[] DEFAULT '{}',
  lab_status text,
  diet_baseline text,
  interest_tags text[] DEFAULT '{}',
  learning_style text,
  primary_track text,
  secondary_tracks text[] DEFAULT '{}',
  all_tags text[] DEFAULT '{}',
  onboarding_complete boolean DEFAULT false
);

-- Add columns if they don't exist (for existing tables)
ALTER TABLE member_profiles ADD COLUMN IF NOT EXISTS primary_goal text;
ALTER TABLE member_profiles ADD COLUMN IF NOT EXISTS biggest_challenge text;
ALTER TABLE member_profiles ADD COLUMN IF NOT EXISTS diagnoses text[] DEFAULT '{}';
ALTER TABLE member_profiles ADD COLUMN IF NOT EXISTS lab_status text;
ALTER TABLE member_profiles ADD COLUMN IF NOT EXISTS diet_baseline text;
ALTER TABLE member_profiles ADD COLUMN IF NOT EXISTS interest_tags text[] DEFAULT '{}';
ALTER TABLE member_profiles ADD COLUMN IF NOT EXISTS learning_style text;
ALTER TABLE member_profiles ADD COLUMN IF NOT EXISTS primary_track text;
ALTER TABLE member_profiles ADD COLUMN IF NOT EXISTS secondary_tracks text[] DEFAULT '{}';
ALTER TABLE member_profiles ADD COLUMN IF NOT EXISTS all_tags text[] DEFAULT '{}';
ALTER TABLE member_profiles ADD COLUMN IF NOT EXISTS onboarding_complete boolean DEFAULT false;

-- Enable RLS
ALTER TABLE member_profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Users can read own member profile" ON member_profiles;
DROP POLICY IF EXISTS "Users can insert own member profile" ON member_profiles;
DROP POLICY IF EXISTS "Users can update own member profile" ON member_profiles;

-- Users can read their own profile
CREATE POLICY "Users can read own member profile"
  ON member_profiles FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own profile
CREATE POLICY "Users can insert own member profile"
  ON member_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own profile
CREATE POLICY "Users can update own member profile"
  ON member_profiles FOR UPDATE
  USING (auth.uid() = user_id);
