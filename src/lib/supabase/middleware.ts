import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { supabaseEnv } from "./env";

const PROTECTED_PREFIX = "/dashboard";
const LOGIN_PATH = "/login";

/**
 * Refreshes the Supabase auth session for every request, then enforces
 * access on `/dashboard/*`. Anonymous visitors are bounced to /login;
 * authenticated visitors landing on /login are sent to /dashboard.
 */
export async function updateSession(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Without Supabase env vars in dev we still want the marketing site
  // to render — just let everything through and surface a clear setup
  // message inside the dashboard.
  if (!supabaseEnv.url || !supabaseEnv.anonKey) {
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(supabaseEnv.url, supabaseEnv.anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value);
        }
        supabaseResponse = NextResponse.next({ request });
        for (const { name, value, options } of cookiesToSet) {
          supabaseResponse.cookies.set(name, value, options);
        }
      },
    },
  });

  // IMPORTANT: never put logic between createServerClient and getUser —
  // the call refreshes the session cookie atomically.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isProtected = pathname === PROTECTED_PREFIX || pathname.startsWith(PROTECTED_PREFIX + "/");

  if (!user && isProtected) {
    const url = request.nextUrl.clone();
    url.pathname = LOGIN_PATH;
    if (pathname !== PROTECTED_PREFIX) {
      url.searchParams.set("next", pathname);
    }
    return NextResponse.redirect(url);
  }

  if (user && pathname === LOGIN_PATH) {
    const url = request.nextUrl.clone();
    url.pathname = PROTECTED_PREFIX;
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
