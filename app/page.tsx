import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { DashboardPanel } from "@/components/dashboard/dashboard-panel";
import { DashboardSkeleton } from "@/components/dashboard/dashboard-skeleton";

export const metadata: Metadata = {
  title: "Dashboard",
};

// The header and footer show straight away; the skeleton fills the page until the dashboard is ready.
export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center bg-zinc-50 px-4 dark:bg-black">
      <SiteHeader />
      <main className="w-full max-w-5xl flex-1 py-6 sm:py-10">
        <Suspense fallback={<DashboardSkeleton />}>
          <SignedInDashboard />
        </Suspense>
      </main>
      <SiteFooter />
    </div>
  );
}

async function SignedInDashboard() {
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

  return <DashboardPanel firstName={firstName} />;
}
