export type Belt = 'white' | 'blue' | 'purple' | 'brown' | 'black';
export type AgeGroup = 'under18' | '18-24' | '25-34' | '35-44' | '45-54' | '55+';

export interface UserProfile {
  id: string;
  name: string;
  age_group: AgeGroup;
  academy: string;
  belt: Belt;
  stripes: number;
  training_frequency: number;
  training_years: number;
}

export interface Training {
  id: string;
  user_id: string;
  gi: boolean;
  duration: number;
  date: string;
  techniques_learned: string[];
  rounds: number;
  round_duration: number;
  submissions: number;
  sweeps: number;
  takedowns: number;
  notes_positive: string;
  notes_improvement: string;
  additional_notes: string;
  created_at: string;
}