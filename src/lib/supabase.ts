import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Supabase env vars (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY) not set. Auth and 2026 data will not work.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
