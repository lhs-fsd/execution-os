import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://demo.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'demo-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// For demo/development without real Supabase credentials
// Data is stored in memory
interface InMemoryStore {
  users: Map<string, any>;
  interviews: Map<string, any>;
  reports: Map<string, any>;
  waitlist: Map<string, any>;
}

export const inMemoryStore: InMemoryStore = {
  users: new Map(),
  interviews: new Map(),
  reports: new Map(),
  waitlist: new Map(),
};

export async function saveUser(userData: any) {
  const id = userData.id || crypto.randomUUID();
  const user = { ...userData, id, created_at: new Date().toISOString() };
  inMemoryStore.users.set(id, user);
  return user;
}

export async function getUser(id: string) {
  return inMemoryStore.users.get(id) || null;
}

export async function saveInterview(interviewData: any) {
  const id = crypto.randomUUID();
  const interview = { ...interviewData, id, created_at: new Date().toISOString() };
  inMemoryStore.interviews.set(id, interview);
  return interview;
}

export async function saveReport(reportData: any) {
  const id = crypto.randomUUID();
  const report = { ...reportData, id, created_at: new Date().toISOString() };
  // Store by both id and user_id for easy retrieval
  inMemoryStore.reports.set(id, report);
  if (reportData.user_id) {
    inMemoryStore.reports.set(reportData.user_id, report);
  }
  return report;
}

export async function getReportByUserId(userId: string) {
  // First try to get by user_id directly
  const report = inMemoryStore.reports.get(userId);
  if (report) return report;
  
  // Fallback to searching
  for (const r of inMemoryStore.reports.values()) {
    if (r.user_id === userId) return r;
  }
  return null;
}

export async function updateUserRecommendation(userId: string, recommendation: string) {
  const user = inMemoryStore.users.get(userId);
  if (user) {
    user.ai_recommendation = recommendation;
    inMemoryStore.users.set(userId, user);
  }
}

export async function saveWaitlistEntry(entryData: any) {
  const id = crypto.randomUUID();
  const entry = { ...entryData, id, created_at: new Date().toISOString() };
  inMemoryStore.waitlist.set(id, entry);
  return entry;
}