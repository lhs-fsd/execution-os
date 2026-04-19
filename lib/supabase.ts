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