import "server-only";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Creates a static-safe Supabase client.
 * During `next build` (static generation), `cookies()` throws an error.
 * This helper ensures that such calls fail gracefully or provide a non-auth client.
 */
export async function createClient() {
  let cookieStore;
  try {
    cookieStore = await cookies();
  } catch (e) {
    // During static generation, cookies() is not available.
    // Return a client without cookie functionality (for public data retrieval).
    return createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          getAll() { return []; },
          setAll() { /* No-op in static context */ },
        },
      }
    );
  }

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing sessions.
          }
        },
      },
    }
  );
}
