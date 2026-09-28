"use client";

import { useAPI } from "@/hooks/use-api";
import type { JobsResponse } from "@/lib/jobs";
import type { MonthlySummaryResponse } from "@/lib/monthly-summary";
import type { TransactionsResponse } from "@/lib/transactions";
import { DashboardClock } from "@/components/dashboard/dashboard-clock";
import { signOut } from "@/app/auth/actions";
import { SignOutIcon } from "@/components/dashboard/dashboard-icons";
import { CurrentJobSection } from "@/components/dashboard/current-job-section";
import { NextJobCard } from "@/components/dashboard/next-job-card";
import { ProfitCard } from "@/components/dashboard/profit-card";
import { MoneyInCard } from "@/components/dashboard/money-in-card";
import { MoneyOutCard } from "@/components/dashboard/money-out-card";
import { TopSpendingCard } from "@/components/dashboard/top-spending-card";
import { ParallaxHero } from "@/components/dashboard/parallax-hero";
import { DASHBOARD_GRID_CLASS_NAME, STATS_GRID_CLASS_NAME } from "@/components/dashboard/dashboard-layout";

const STATS_SECTION_ID = "stats";

// Clock and current job on the left; the cards on the right.
// On mobile the current job is a full screen hero, and the cards scroll up over it.
export function DashboardPanel({ firstName }: { firstName: string }) {
  const {
    data: jobsResponse,
    error: jobsError,
    sendRequest: sendJobsRequest,
  } = useAPI<JobsResponse>("/api/jobs");
  const {
    data: monthlySummary,
    error: monthlySummaryError,
    refetch: refetchMonthlySummary,
  } = useAPI<MonthlySummaryResponse>("/api/monthly-summary");
  const {
    data: transactionsResponse,
    error: transactionsError,
    refetch: refetchTransactions,
  } = useAPI<TransactionsResponse>("/api/transactions");

  // Marks the job done (which adds its price to money in), then reloads the money cards.
  async function completeJob(jobId: string) {
    await sendJobsRequest("PATCH", { jobId, status: "done" });
    refetchMonthlySummary();
    refetchTransactions();
  }

  const hasError = Boolean(jobsError || monthlySummaryError || transactionsError);
  const transactions = transactionsResponse?.transactions ?? null;

  return (
    <div className={DASHBOARD_GRID_CLASS_NAME}>
      <h1 className="sr-only">Dashboard</h1>

      <ParallaxHero statsSectionId={STATS_SECTION_ID} hasStats={!hasError}>
        {/* On mobile the clock and sign out share a compact row, so the current job stays the hero. */}
        <div className="flex items-start justify-between gap-4 lg:block">
          <DashboardClock firstName={firstName} />
          <form action={signOut} className="lg:mt-3">
            <button
              type="submit"
              className="flex items-center gap-1.5 text-xs font-medium text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
            >
              <SignOutIcon />
              Sign out
            </button>
          </form>
        </div>

        {/* On desktop it sits at the bottom so the "Job Done" button lines up with the bottom of the cards.
            On mobile it stretches to fill the hero, with the job details centered above the button. */}
        <div className="flex flex-1 lg:items-end">
          {!hasError && <CurrentJobSection jobsResponse={jobsResponse} onJobDone={completeJob} />}
        </div>
      </ParallaxHero>

      {hasError ? (
        <p
          role="alert"
          className="self-start rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/50 dark:text-red-300"
        >
          Couldn&apos;t load your dashboard. Please refresh to try again.
        </p>
      ) : (
        // On mobile this is a sheet that slides up over the hero, with Money in and Money out side by side.
        <div
          id={STATS_SECTION_ID}
          className={STATS_GRID_CLASS_NAME}
        >
          <ProfitCard monthlySummary={monthlySummary} className="col-span-2" />
          <MoneyInCard monthlySummary={monthlySummary} transactionsResponse={transactionsResponse} />
          <MoneyOutCard monthlySummary={monthlySummary} />
          <NextJobCard nextJobs={jobsResponse?.nextJobs ?? null} className="col-span-2 md:col-span-1" />
          <TopSpendingCard transactions={transactions} className="col-span-2 md:col-span-1" />
        </div>
      )}
    </div>
  );
}
