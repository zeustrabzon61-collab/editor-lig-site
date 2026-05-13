import { createClient } from '@supabase/supabase-js';

// Bu değerler kullanıcı tarafından sağlandığında güncellenecek
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
