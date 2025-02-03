/*
  # Initial Schema for JornadaBJJ

  1. New Tables
    - `profiles`
      - User profile information including belt rank and training history
    - `trainings`
      - Training session records with techniques and performance metrics

  2. Security
    - Enable RLS on all tables
    - Add policies for user data access
*/

-- Create profiles table
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  name text NOT NULL,
  age_group text NOT NULL,
  academy text NOT NULL,
  belt text NOT NULL,
  stripes integer NOT NULL DEFAULT 0,
  training_frequency integer NOT NULL DEFAULT 0,
  training_years integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create trainings table
CREATE TABLE trainings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) NOT NULL,
  gi boolean NOT NULL DEFAULT true,
  duration integer NOT NULL,
  date date NOT NULL,
  techniques_learned text[] DEFAULT '{}',
  rounds integer NOT NULL DEFAULT 0,
  round_duration integer NOT NULL DEFAULT 0,
  submissions integer NOT NULL DEFAULT 0,
  sweeps integer NOT NULL DEFAULT 0,
  takedowns integer NOT NULL DEFAULT 0,
  notes_positive text,
  notes_improvement text,
  additional_notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE trainings ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Trainings policies
CREATE POLICY "Users can read own trainings"
  ON trainings
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own trainings"
  ON trainings
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own trainings"
  ON trainings
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own trainings"
  ON trainings
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create function to handle updated_at
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER handle_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER handle_trainings_updated_at
  BEFORE UPDATE ON trainings
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();