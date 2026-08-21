import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY;

export function createAdminClient() {
  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing Supabase server key. Add SUPABASE_SECRET_KEY or SUPABASE_SERVICE_ROLE_KEY to .env and restart Next.js.");
  }

  return createClient(supabaseUrl, supabaseKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
