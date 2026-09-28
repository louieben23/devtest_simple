import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { DashboardPanel } from "@/components/dashboard/dashboard-panel";

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

  const firstName = profile?.full_name?.split(" ")[0] ?? user.email ?? "there";

  return (
    <div className="flex flex-1 flex-col items-center bg-zinc-50 px-4 dark:bg-black">
      <SiteHeader />
      <main className="w-full max-w-5xl flex-1 py-6 sm:py-10">
        <DashboardPanel firstName={firstName} />
      </main>
      <SiteFooter />
    </div>
  );
}
