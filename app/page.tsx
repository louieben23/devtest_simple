import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/app/auth/actions";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { MonthlySummary } from "@/components/dashboard/monthly-summary";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function Home() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // RLS ensures this only returns the caller's own row.
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .single();

  const firstName = profile?.full_name?.split(" ")[0] ?? user.email;

  return (
    <div className="flex flex-1 flex-col items-center bg-zinc-50 px-4 dark:bg-black">
      <SiteHeader />
      <main className="flex w-full max-w-5xl flex-1 flex-col gap-10 py-12 sm:py-20">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">Welcome back, {firstName}</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-black dark:text-zinc-50">
              This month
            </h1>
          </div>
          <form action={signOut}>
            <button
              type="submit"
              className="h-9 rounded-full border border-black/[.12] px-4 text-sm font-medium text-zinc-900 transition-colors hover:bg-white dark:border-white/[.2] dark:text-zinc-50 dark:hover:bg-zinc-800"
            >
              Sign out
            </button>
          </form>
        </div>

        <MonthlySummary />
      </main>
      <SiteFooter />
    </div>
  );
}
