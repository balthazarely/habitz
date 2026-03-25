import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

// Turbopack/webpack can evaluate this module more than once across different
// chunk contexts. Using globalThis ensures only one GoTrue auth instance
// (and one Web Lock) exists, preventing "lock stolen" errors.
const g = globalThis as typeof globalThis & { __supabase?: SupabaseClient };

export const supabase: SupabaseClient =
  g.__supabase ??
  (g.__supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  ));
