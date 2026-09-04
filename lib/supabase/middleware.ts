import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { validateRedirectPath } from "@/lib/auth/redirect-validation";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://bbpzmxdnitdwlvlwbric.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJicHpteGRuaXRkd2x2bHdicmljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg0MjYzNzYsImV4cCI6MjEwNDAwMjM3Nn0.4FrP1l5ZzKfivSPaqVvHjb7vdzSPqz2vIeu2SVWGMUE";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        supabaseResponse = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  // IMPORTANT: Avoid using getUser() in a way that blocks unauthenticated public pages.
  // getUser() validates the token against Supabase Auth.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // Protect /account routes
  if (pathname.startsWith("/account")) {
    if (!user) {
      const redirectUrl = new URL("/auth", request.url);
      const safeRedirect = validateRedirectPath(pathname + request.nextUrl.search, "/account");
      redirectUrl.searchParams.set("redirect", safeRedirect);
      return NextResponse.redirect(redirectUrl);
    }
  }

  // If already logged in and visiting /auth (without specific sub-actions), redirect to /account
  if (pathname === "/auth" && user) {
    const rawRedirect = request.nextUrl.searchParams.get("redirect");
    const safeRedirect = validateRedirectPath(rawRedirect, "/account");
    return NextResponse.redirect(new URL(safeRedirect, request.url));
  }

  return supabaseResponse;
}
