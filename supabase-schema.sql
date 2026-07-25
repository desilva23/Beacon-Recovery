-- Run this SQL in Supabase Dashboard > SQL Editor

-- Interventions / Journal table
CREATE TABLE IF NOT EXISTS interventions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  raw_transcript TEXT,
  ai_severity_score TEXT CHECK (ai_severity_score IN ('low', 'medium', 'high')),
  ai_identified_trigger TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE interventions ENABLE ROW LEVEL SECURITY;

-- Patients can only read and insert their own records
CREATE POLICY "Patients own their interventions"
  ON interventions
  FOR ALL
  USING (auth.uid() = patient_id)
  WITH CHECK (auth.uid() = patient_id);
