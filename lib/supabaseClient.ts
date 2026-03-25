import { createBrowserClient } from "@supabase/ssr";
import { processLock } from "@supabase/auth-js";
import type { SupabaseClient } from "@supabase/supabase-js";

// Using globalThis ensures only one GoTrue auth instance exists even if this
// module is evaluated multiple times across webpack chunk boundaries.
//
// Using processLock instead of the default navigatorLock prevents the
// "lock stolen" error: navigatorLock uses steal:true after a 5-second timeout,
// which fires on Vercel cold-start when token refresh takes >5s. processLock
// queues operations without any steal mechanism, so slow refreshes just
// complete normally instead of aborting and causing all DB queries to fail.
const g = globalThis as typeof globalThis & { __supabase?: SupabaseClient };

export const supabase: SupabaseClient =
  g.__supabase ??
  (g.__supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { lock: processLock } },
  ));
