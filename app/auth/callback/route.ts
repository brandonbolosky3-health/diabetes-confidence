import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendWelcomeEmail } from "@/lib/email";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/member";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // Send welcome email for new users
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const isNewUser =
          user.created_at &&
          Date.now() - new Date(user.created_at).getTime() < 60_000;
        if (isNewUser) {
          const firstName =
            user.user_metadata?.first_name ||
            (user.email || "").split("@")[0].charAt(0).toUpperCase() +
              (user.email || "").split("@")[0].slice(1);
          sendWelcomeEmail(user.email!, firstName).catch(() => {});
        }
      }
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth`);
}
