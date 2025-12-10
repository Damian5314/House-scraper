'use client';

import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

// Check if Supabase is properly configured
const isConfigured = supabaseUrl &&
  supabaseKey &&
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
    client = createBrowserClient(supabaseUrl!, supabaseKey!);
  }

  return client;
}

export { isConfigured };
