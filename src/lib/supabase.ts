import { createClient } from '@supabase/supabase-js';

// Live Canvas India Supabase instance fallback
const DEFAULT_SUPABASE_URL = 'https://akyzyctnhskpyextkigp.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'sb_publishable_OrFdJy-OMX1gxlg27iVjmA_Jw9y5922';

const rawUrl = ((import.meta.env.VITE_SUPABASE_URL as string | undefined) || '').trim();
const rawKey = ((import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) || '').trim();

const supabaseUrl = rawUrl || DEFAULT_SUPABASE_URL;
const supabaseAnonKey = rawKey || DEFAULT_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith('https://') &&
  !supabaseUrl.includes('placeholder') &&
  !supabaseUrl.includes('your-supabase-project-url') &&
  supabaseAnonKey !== 'your-anon-key' &&
  !supabaseAnonKey.includes('placeholder')
);

// Provide a valid client instance connected to live Supabase
export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);
