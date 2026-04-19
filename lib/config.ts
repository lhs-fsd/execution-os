export const BASE_PATH = '/execution-os';

export const supabaseUrl = 'https://sszwlcfagfbbsgqmjded.supabase.co';
export const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNzendsY2ZhZ2ZiYnNncW1qZGVkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY1ODc2MTcsImV4cCI6MjA5MjE2MzYxN30.3Gzv3Z95DXRyDJRJWvZfCLjziBWlHjVRkD_Kk6gh74I';

import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);