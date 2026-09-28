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

// Clock and current job on the left; the cards on the right.
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
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[16rem_minmax(0,1fr)]">
      <h1 className="sr-only">Dashboard</h1>

      <aside className="flex flex-col gap-8 py-2">
        <div>
          <DashboardClock firstName={firstName} />
          <form action={signOut} className="mt-3">
            <button
              type="submit"
              className="flex items-center gap-1.5 text-xs font-medium text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
            >
              <SignOutIcon />
              Sign out
            </button>
          </form>
        </div>

        <div className="flex items-center lg:flex-1">
          {!hasError && <CurrentJobSection jobsResponse={jobsResponse} onJobDone={completeJob} />}
        </div>
      </aside>

      {hasError ? (
        <p
          role="alert"
          className="self-start rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/50 dark:text-red-300"
        >
          Couldn&apos;t load your dashboard. Please refresh to try again.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <ProfitCard monthlySummary={monthlySummary} className="md:col-span-2" />
          <MoneyInCard monthlySummary={monthlySummary} transactionsResponse={transactionsResponse} />
          <MoneyOutCard monthlySummary={monthlySummary} />
          <NextJobCard nextJobs={jobsResponse?.nextJobs ?? null} />
          <TopSpendingCard transactions={transactions} />
        </div>
      )}
    </div>
  );
}
