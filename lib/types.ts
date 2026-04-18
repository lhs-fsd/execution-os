export interface User {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  budget_tier: 'low' | 'medium' | 'high';
  ai_recommendation: 'blueprint' | 'premium';
  execution_score: number;
  created_at: string;
}

export interface Interview {
  id: string;
  user_id: string;
  budget: string;
  occupation: string;
  goals: string;
  struggles: string;
  routine: string;
  inconsistency_reason: string;
  time_available: string;
  tools_used: string[];
  created_at: string;
}

export interface Report {
  id: string;
  user_id: string;
  execution_score: number;
  primary_bottleneck: string;
  secondary_bottlenecks: string[];
  behavioral_pattern: string;
  psychological_root: string;
  risk_level: 'low' | 'medium' | 'high';
  fix_plan: string[];
  created_at: string;
}

export interface WaitlistEntry {
  id: string;
  user_id: string;
  selected_plan: string;
  recommended_plan: string;
  budget_tier: string;
  execution_score: number;
  final_ai_reasoning: string;
  created_at: string;
}

export interface InterviewFormData {
  fullName: string;
  email: string;
  phone: string;
  budget: string;
  occupation: string;
  goals: string;
  struggles: string;
  routine: string;
  inconsistencyReason: string;
  timeAvailable: string;
  toolsUsed: string[];
}

export interface WaitlistFormData {
  fullName: string;
  email: string;
  phone: string;
}