import { NextResponse } from "next/server";
import { createClient as createSSRClient } from "../../../lib/supabase/server";
import { createClient as createJSClient } from "@supabase/supabase-js";

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/account";

  if (code) {
    const supabase = await createSSRClient();
    const { data: sessionData, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error && sessionData?.session) {
      // Ensure profile is updated/exists upon login
      const user = sessionData.user;
      if (user) {
        const fullName = user.user_metadata?.full_name || user.user_metadata?.name || "";
        const avatarUrl = user.user_metadata?.avatar_url || user.user_metadata?.picture || "";
        
        // Explicitly create an authorized client since the SSR client's req.cookies don't have the token yet
        const authClient = createJSClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
          { global: { headers: { Authorization: `Bearer ${sessionData.session.access_token}` } } }
        );

        const { error: profileError } = await authClient.from("profiles").upsert({
          id: user.id,
          full_name: fullName,
          avatar_url: avatarUrl,
        }, { onConflict: "id" });

        if (profileError) console.error("Profile update error:", profileError);
      }
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}
