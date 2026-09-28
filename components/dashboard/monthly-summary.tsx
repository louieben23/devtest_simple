"use client";

import { useAPI } from "@/hooks/use-api";
import {
  getProfitSentiment,
  getTrendSentiment,
  type MonthlySummaryResponse,
} from "@/lib/monthly-summary";
import { StatCard, StatCardSkeleton } from "@/components/dashboard/stat-card";

const STAT_LABELS = ["Money in", "Money out", "Profit"];

export function MonthlySummary() {
  const { data: monthlySummary, error, isLoading } =
    useAPI<MonthlySummaryResponse>("/api/monthly-summary");

  if (error) {
    return (
      <p
        role="alert"
        className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/50 dark:text-red-300"
      >
        Couldn&apos;t load this month&apos;s numbers. Please refresh to try again.
      </p>
    );
  }

  return (
    <section aria-label="This month's summary">
      <p className="mb-4 text-sm text-zinc-600 dark:text-zinc-400">
        {isLoading || !monthlySummary ? " " : monthlySummary.monthLabel}
      </p>

      <div className="grid gap-px overflow-hidden rounded-2xl border border-black/[.08] bg-black/[.08] sm:grid-cols-3 dark:border-white/[.145] dark:bg-white/[.145]">
        {isLoading || !monthlySummary ? (
          STAT_LABELS.map((label) => <StatCardSkeleton key={label} label={label} />)
        ) : (
          <>
            <StatCard
              label="Money in"
              amountCents={monthlySummary.currentMonth.moneyInCents}
              previousAmountCents={monthlySummary.previousMonth.moneyInCents}
              sentiment={getTrendSentiment(
                monthlySummary.currentMonth.moneyInCents,
                monthlySummary.previousMonth.moneyInCents,
                true,
              )}
            />
            <StatCard
              label="Money out"
              amountCents={monthlySummary.currentMonth.moneyOutCents}
              previousAmountCents={monthlySummary.previousMonth.moneyOutCents}
              sentiment={getTrendSentiment(
                monthlySummary.currentMonth.moneyOutCents,
                monthlySummary.previousMonth.moneyOutCents,
                false,
              )}
            />
            <StatCard
              label="Profit"
              amountCents={monthlySummary.currentMonth.profitCents}
              previousAmountCents={monthlySummary.previousMonth.profitCents}
              sentiment={getProfitSentiment(monthlySummary.currentMonth.profitCents)}
            />
          </>
        )}
      </div>
    </section>
  );
}
