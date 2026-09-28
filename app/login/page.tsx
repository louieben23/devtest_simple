import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { safeNextPath } from "@/lib/safe-redirect";
import { signInWithGoogle } from "@/app/auth/actions";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "Sign in",
};

const ERROR_MESSAGES: Record<string, string> = {
  oauth_start_failed: "Couldn't start Google sign-in. Please try again.",
  auth_callback_failed: "Sign-in didn't complete. Please try again.",
};

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const params = await searchParams;
  const next = safeNextPath(params.next);
  const errorKey = typeof params.error === "string" ? params.error : undefined;

  // Already signed in? Skip the login screen.
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (data?.claims) redirect(next);

  return (
    <div className="flex flex-1 flex-col items-center bg-zinc-50 px-4 dark:bg-black">
      <SiteHeader />
      <main className="flex w-full max-w-sm flex-1 flex-col justify-center">
        <h1 className="text-2xl text-center font-semibold tracking-tight text-black dark:text-zinc-50">
          Welcome to Angus Shield

        </h1>
        <p className="mt-2 text-sm text-center text-zinc-600 dark:text-zinc-400">
          Sign in to continue.
        </p>

        {errorKey && (
          <p
            role="alert"
            className="mt-6 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/50 dark:text-red-300"
          >
            {ERROR_MESSAGES[errorKey] ?? "Something went wrong. Please try again."}
          </p>
        )}

        <form action={signInWithGoogle} className="mt-8">
          <input type="hidden" name="next" value={next} />
          <button
            type="submit"
            className="flex h-11 w-full items-center justify-center gap-3 rounded-full border border-black/[.12] bg-white px-5 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-50 dark:border-white/[.2] dark:bg-zinc-900 dark:text-zinc-50 dark:hover:bg-zinc-800"
          >
            <GoogleIcon />
            Continue with Google
          </button>
        </form>
      </main>
      <SiteFooter />
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 48 48">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
    </svg>
  );
}
