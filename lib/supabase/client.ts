import { createBrowserClient } from '@supabase/ssr';

/**
 * lib/supabase/client.ts
 * ----------------------
 * Browser-side Supabase client.
 * Use this in Client Components ('use client').
 * Creates a singleton instance to avoid multiple connections.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}