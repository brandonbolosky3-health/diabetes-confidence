-- Create consultation_forms table
CREATE TABLE IF NOT EXISTS consultation_forms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  appointment_id uuid,
  submitted_at timestamptz DEFAULT now(),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'submitted')),

  -- Personal info
  full_name text,
  date_of_birth date,
  phone text,
  email text,
  address text,
  city text,
  state text,
  zip text,
  how_did_you_hear text,
  occupation text,
  is_pregnant boolean,

  -- Symptoms checklist
  symptom_headache boolean DEFAULT false,
  symptom_knee_pain boolean DEFAULT false,
  symptom_back_neck_pain boolean DEFAULT false,
  symptom_arthritis boolean DEFAULT false,
  symptom_digestion boolean DEFAULT false,
  symptom_cardiovascular boolean DEFAULT false,
  symptom_hypertension boolean DEFAULT false,
  symptom_anxiety_depression boolean DEFAULT false,
  symptom_diabetes boolean DEFAULT false,
  symptom_memory_decline boolean DEFAULT false,
  symptom_fatigue boolean DEFAULT false,
  symptom_breathing boolean DEFAULT false,
  symptom_sleep boolean DEFAULT false,
  symptom_nerve_pain_neuropathy boolean DEFAULT false,
  symptom_skin_issue boolean DEFAULT false,
  symptom_other_joint_pain text,
  symptom_other_conditions text,

  -- Chief complaint
  worst_symptom text,
  condition_duration text,
  condition_frequency text,
  pain_scale integer CHECK (pain_scale >= 1 AND pain_scale <= 10),
  what_has_not_helped text,
  life_in_3_years_if_worse text,
  life_if_resolved text,

  -- Quality of life - suffering from
  suffer_irritability boolean DEFAULT false,
  suffer_interrupted_sleep boolean DEFAULT false,
  suffer_restricted_activity boolean DEFAULT false,
  suffer_mood_disorder boolean DEFAULT false,
  suffer_fatigue boolean DEFAULT false,
  suffer_decline_in_activity boolean DEFAULT false,

  -- Quality of life - life impact
  impact_family_social boolean DEFAULT false,
  impact_work_income boolean DEFAULT false,
  impact_productivity_household boolean DEFAULT false,
  impact_exercise_sports boolean DEFAULT false,
  impact_hobbies boolean DEFAULT false
);

-- Index for fast lookups by member
CREATE INDEX idx_consultation_forms_member_id ON consultation_forms(member_id);

-- Enable RLS
ALTER TABLE consultation_forms ENABLE ROW LEVEL SECURITY;

-- Users can read their own forms
CREATE POLICY "Users can read own consultation forms"
  ON consultation_forms FOR SELECT
  USING (auth.uid() = member_id);

-- Users can insert their own forms
CREATE POLICY "Users can insert own consultation forms"
  ON consultation_forms FOR INSERT
  WITH CHECK (auth.uid() = member_id);

-- Users can update their own forms
CREATE POLICY "Users can update own consultation forms"
  ON consultation_forms FOR UPDATE
  USING (auth.uid() = member_id);
