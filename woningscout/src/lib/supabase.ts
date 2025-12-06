'use client';

import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Check if Supabase is properly configured
const isConfigured = supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== 'your_supabase_url' &&
  supabaseUrl.includes('supabase.co');

// Create a singleton client
let client: ReturnType<typeof createBrowserClient> | null = null;

export function createClient() {
  if (!isConfigured) {
    // Return null during build or when not configured
    return null;
  }

  if (!client) {
    client = createBrowserClient(supabaseUrl!, supabaseAnonKey!);
  }

  return client;
}

export { isConfigured };
