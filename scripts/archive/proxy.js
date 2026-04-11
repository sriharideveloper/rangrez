import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

export async function proxy(request) {
  let requestHeaders = new Headers(request.headers);

  // ── FIX: ALIGN ORIGIN WITH X-FORWARDED-HOST FOR CODESPACES ──
  const xForwardedHost = requestHeaders.get("x-forwarded-host");
  if (xForwardedHost) {
    const proto = requestHeaders.get("x-forwarded-proto") || "https";
    requestHeaders.set("origin", `${proto}://${xForwardedHost}`);
  }

  let supabaseResponse = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // ═══ 1. PROTECT ADMIN ROUTES ═══
  if (request.nextUrl.pathname.startsWith("/admin")) {
    if (!user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // ═══ 2. PROTECT ACCOUNT ROUTES ═══
  if (request.nextUrl.pathname.startsWith("/account")) {
    if (!user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // ═══ 3. PROTECT CHECKOUT ═══
  if (request.nextUrl.pathname.startsWith("/checkout")) {
    if (!user) {
      return NextResponse.redirect(
        new URL("/login?next=/checkout", request.url),
      );
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
