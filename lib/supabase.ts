import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://sszwlcfagfbbsgqmjded.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNzendsY2ZhZ2ZiYnNncW1qZGVkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY1ODc2MTcsImV4cCI6MjA5MjE2MzYxN30.3Gzv3Z95DXRyDJRJWvZfCLjziBWlHjVRkD_Kk6gh74I';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function saveUser(userData: any) {
  const id = userData.id || crypto.randomUUID();
  const user = { ...userData, id, created_at: new Date().toISOString() };
  
  const { data, error } = await supabase
    .from('users')
    .upsert({ ...user, id })
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function getUser(id: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) return null;
  return data;
}

export async function saveInterview(interviewData: any) {
  const id = crypto.randomUUID();
  const interview = { ...interviewData, id, created_at: new Date().toISOString() };
  
  const { data, error } = await supabase
    .from('interviews')
    .insert(interview)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function saveReport(reportData: any) {
  const id = crypto.randomUUID();
  const report = { ...reportData, id, created_at: new Date().toISOString() };
  
  const { data, error } = await supabase
    .from('reports')
    .insert(report)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function getReportByUserId(userId: string) {
  const { data, error } = await supabase
    .from('reports')
    .select('*')
    .eq('user_id', userId)
    .single();
  
  if (error) return null;
  return data;
}

export async function updateUserRecommendation(userId: string, recommendation: string) {
  const { error } = await supabase
    .from('users')
    .update({ ai_recommendation: recommendation })
    .eq('id', userId);
  
  if (error) throw error;
}

export async function saveWaitlistEntry(entryData: any) {
  const id = crypto.randomUUID();
  const entry = { ...entryData, id, created_at: new Date().toISOString() };
  
  const { data, error } = await supabase
    .from('waitlist')
    .insert(entry)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function getWaitlistEntries() {
  const { data, error } = await supabase
    .from('waitlist')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
}

export interface ReportData {
  execution_score: number;
  primary_bottleneck: string;
  secondary_bottlenecks: string[];
  behavioral_pattern: string;
  psychological_root: string;
  risk_level: 'low' | 'medium' | 'high';
  fix_plan: string[];
  ai_recommendation: 'blueprint' | 'premium';
}

export async function generateExecutionReport(interviewData: any): Promise<ReportData> {
  const budget = interviewData.budget_tier || interviewData.budget || 'medium';
  const struggles = interviewData.struggles || '';
  const goals = interviewData.goals || '';
  const routine = interviewData.routine || '';
  const inconsistencyReason = interviewData.inconsistency_reason || '';
  const timeAvailable = interviewData.time_available || '';
  
  let score = 50;
  const s = struggles.toLowerCase();
  
  if (s.length > 10) {
    if (s.includes('procrastin') || s.includes('delay') || s.includes('postpone')) score -= 18;
    if (s.includes('distract') || s.includes('social media') || s.includes('phone') || s.includes('scroll')) score -= 15;
    if (s.includes('focus') || s.includes('concentrat') || s.includes('attention')) score -= 14;
    if (s.includes('motivat') || s.includes('drive') || s.includes('want') || s.includes('feel like')) score -= 12;
    if (s.includes('time') || s.includes('busy') || s.includes('no time')) score -= 10;
    if (s.includes('overwhelm') || s.includes('much') || s.includes('lot')) score -= 16;
    if (s.includes('tired') || s.includes('exhaust') || s.includes('sleep') || s.includes('energy')) score -= 14;
    if (s.includes('lazy') || s.includes('dont want') || s.includes('no motivation')) score -= 18;
    if (s.includes('stuck') || s.includes('block') || s.includes('cant start')) score -= 12;
    if (s.includes('waste') || s.includes('lose') || s.includes('never finish')) score -= 12;
  } else {
    score -= 20;
  }
  
  const g = goals.toLowerCase();
  if (g.length > 15) {
    if (g.includes('money') || g.includes('wealth') || g.includes('financial') || g.includes('income')) score += 8;
    if (g.includes('learn') || g.includes('skill') || g.includes('knowledge') || g.includes('grow')) score += 7;
    if (g.includes('health') || g.includes('fitness') || g.includes('exercise')) score += 6;
    if (g.includes('career') || g.includes('job') || g.includes('business')) score += 6;
    if (g.includes('family') || g.includes('relationship') || g.includes('friend')) score += 5;
  } else {
    score -= 8;
  }
  
  const ir = inconsistencyReason.toLowerCase();
  if (ir.length > 10) {
    if (ir.includes('fear') || ir.includes('scared') || ir.includes('worried')) score -= 14;
    if (ir.includes('perfection') || ir.includes('perfect') || ir.includes('right')) score -= 10;
    if (ir.includes('anxiety') || ir.includes('stress') || ir.includes('overthink')) score -= 12;
    if (ir.includes('doubt') || ir.includes('unsure') || ir.includes('not sure')) score -= 8;
    if (ir.includes('tired') || ir.includes('exhaust') || ir.includes('burnout')) score -= 12;
    if (ir.includes('lazy') || ir.includes('comfort') || ir.includes('easy')) score -= 15;
  }
  
  const t = timeAvailable.toLowerCase();
  if (t.includes('less than') || t.includes('1 hour')) score -= 8;
  if (t.includes('4') || t.includes('many')) score += 6;
  
  if (budget === 'high') score += 10;
  if (budget === 'medium') score += 5;
  
  const executionScore = Math.max(15, Math.min(95, score));
  const riskLevel = executionScore < 40 ? 'high' : executionScore < 65 ? 'medium' : 'low';
  
  let primaryBottleneck = 'Decision Fatigue & Analysis Paralysis';
  if (s.includes('distract') || s.includes('social') || s.includes('phone')) primaryBottleneck = 'Digital Distraction Syndrome';
  else if (s.includes('time') || s.includes('busy')) primaryBottleneck = 'Time Blindness & Prioritization Failure';
  else if (s.includes('motivat') || s.includes('start')) primaryBottleneck = 'Activation Energy Barrier';
  else if (s.includes('focus') || s.includes('attention')) primaryBottleneck = 'Sustained Attention Deficit';
  else if (s.includes('procrastin') || s.includes('delay')) primaryBottleneck = 'Chronic Procrastination Pattern';
  else if (s.includes('overwhelm')) primaryBottleneck = 'Cognitive Overload & Task Saturation';
  else if (s.includes('tired') || s.includes('exhaust')) primaryBottleneck = 'Energy Management Failure';
  else if (s.includes('lazy')) primaryBottleneck = 'Motivational Depletion & Interest Loss';
  
  const secondaryBottlenecks: string[] = [];
  if (!goals || goals.length < 20) secondaryBottlenecks.push('Unclear Goal Hierarchy');
  if (!routine || routine.length < 20) secondaryBottlenecks.push('No Structured Daily Framework');
  if (ir.includes('perfection')) secondaryBottlenecks.push('Perfectionism Paralysis');
  if (ir.includes('fear')) secondaryBottlenecks.push('Fear-Based Avoidance');
  while (secondaryBottlenecks.length < 2) {
    const extras = ['Lack of External Accountability', 'Environment Trigger Management', 'Reward Depreciation Pattern'];
    const randomExtra = extras[Math.floor(Math.random() * extras.length)];
    if (!secondaryBottlenecks.includes(randomExtra)) secondaryBottlenecks.push(randomExtra);
  }
  
  let behavioralPattern = 'Inconsistent execution pattern - starts with intention but loses momentum before completion.';
  if (ir.includes('start') && ir.includes('finish')) behavioralPattern = 'False Start Pattern - excellent planning, collapses before completion.';
  else if (ir.includes('burst') || ir.includes('intense')) behavioralPattern = 'Burst-and-Collapse Cycle - periods of intense productivity followed by shutdown.';
  else if (ir.includes('procrastin')) behavioralPattern = 'Snooze-and-Repeat Pattern - constantly defers tasks.';
  
  let psychologicalRoot = 'Your brain has learned that effort required feels greater than anticipated reward.';
  if (ir.includes('fear')) psychologicalRoot = 'Fear of failure creates an avoidance response.';
  else if (ir.includes('perfection')) psychologicalRoot = 'Perfectionism creates a catch-22 - you cannot produce perfect work without starting.';
  else if (ir.includes('motivat')) psychologicalRoot = 'Your brain has devalued the future reward - the payoff seems too far away.';
  
  const fixPlan: string[] = [];
  fixPlan.push('Start by identifying your most important task each morning. Complete this one task before checking anything else.');
  if (secondaryBottlenecks.includes('Unclear Goal Hierarchy')) fixPlan.push('Define your goals using SMART framework - Specific, Measurable, Achievable, Relevant, Time-bound.');
  else fixPlan.push('Build external accountability - share your goals with someone who will check in weekly.');
  fixPlan.push('Track your consistency using a simple streak counter. Build the identity of someone who follows through.');
  
  let aiRecommendation: 'blueprint' | 'premium' = 'blueprint';
  if (budget === 'high' && executionScore < 60) aiRecommendation = 'premium';
  else if (budget === 'medium' && executionScore < 40) aiRecommendation = 'premium';
  
  return {
    execution_score: executionScore,
    primary_bottleneck: primaryBottleneck,
    secondary_bottlenecks: secondaryBottlenecks.slice(0, 2),
    behavioral_pattern: behavioralPattern,
    psychological_root: psychologicalRoot,
    risk_level: riskLevel,
    fix_plan: fixPlan,
    ai_recommendation: aiRecommendation,
  };
}