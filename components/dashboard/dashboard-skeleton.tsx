import { Skeleton } from "@/components/skeleton";
import { DASHBOARD_GRID_CLASS_NAME, STATS_GRID_CLASS_NAME } from "@/components/dashboard/dashboard-layout";
import { CurrentJobSkeleton } from "@/components/dashboard/current-job-section";
import { NextJobCard } from "@/components/dashboard/next-job-card";
import { ProfitCard } from "@/components/dashboard/profit-card";
import { MoneyInCard } from "@/components/dashboard/money-in-card";
import { MoneyOutCard } from "@/components/dashboard/money-out-card";
import { TopSpendingCard } from "@/components/dashboard/top-spending-card";

// Shown while the page checks who is signed in. It has the same layout as DashboardPanel,
// and the cards are the real cards in their loading state, so nothing jumps when the dashboard arrives.
export function DashboardSkeleton() {
  return (
    <div aria-busy="true" className={DASHBOARD_GRID_CLASS_NAME}>
      <p role="status" className="sr-only">
        Loading your dashboard…
      </p>

      {/* Matches ParallaxHero: fills the screen below the site header on mobile. */}
      <div className="flex flex-col pt-2 max-lg:min-h-[calc(100svh-7.5rem)]">
        <div className="flex flex-1 flex-col gap-6 lg:gap-8">
          <div className="flex items-start justify-between gap-4 lg:block">
            {/* Time, then the greeting and first name. */}
            <div>
              <Skeleton className="h-8 w-28 rounded-md lg:h-10 lg:w-32" />
              <Skeleton className="mt-3 h-4 w-24 rounded-md lg:mt-4" />
              <Skeleton className="mt-1.5 h-4 w-16 rounded-md" />
            </div>
            <Skeleton className="h-4 w-16 rounded-md lg:mt-3" />
          </div>

          <div className="flex flex-1 lg:items-end">
            <CurrentJobSkeleton />
          </div>
        </div>

        {/* Stands in for the "Scroll for Stats" indicator. */}
        <Skeleton className="mx-auto mt-6 h-9 w-28 rounded-md lg:hidden" />
      </div>

      <div className={STATS_GRID_CLASS_NAME}>
        <ProfitCard monthlySummary={null} className="col-span-2" />
        <MoneyInCard monthlySummary={null} transactionsResponse={null} />
        <MoneyOutCard monthlySummary={null} />
        <NextJobCard nextJobs={null} className="col-span-2 md:col-span-1" />
        <TopSpendingCard transactions={null} className="col-span-2 md:col-span-1" />
      </div>
    </div>
  );
}
