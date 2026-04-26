import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh session — keeps the user logged in across tab navigations
  const { data: { user } } = await supabase.auth.getUser();

  // Protect member routes — redirect unauthenticated users to /login.
  // The /member check is intentionally exact-or-subpath so it does NOT
  // match the public /membership marketing page.
  const pathname = request.nextUrl.pathname;
  const isMemberRoute = pathname === "/member" || pathname.startsWith("/member/");
  if (
    !user &&
    (isMemberRoute ||
      pathname.startsWith("/dashboard") ||
      pathname.startsWith("/onboarding") ||
      pathname.startsWith("/consultation-form") ||
      pathname.startsWith("/lessons") ||
      pathname.startsWith("/learn") ||
      pathname.startsWith("/ai") ||
      pathname.startsWith("/videos") ||
      pathname.startsWith("/guides") ||
      pathname.startsWith("/community") ||
      pathname.startsWith("/admin"))
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Protect admin routes — only allow whitelisted emails
  if (pathname.startsWith("/admin") && user) {
    const adminEmails = (process.env.ADMIN_EMAILS || "")
      .split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);
    const userEmail = (user.email || "").toLowerCase();
    if (!adminEmails.includes(userEmail)) {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
