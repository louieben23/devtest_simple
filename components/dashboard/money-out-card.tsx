import {
  formatWholeCurrency,
  getTrendSentiment,
  type MonthlySummaryResponse,
} from "@/lib/monthly-summary";
import {
  BigAmount,
  CardBodySkeleton,
  DashboardCard,
  TrendBadge,
} from "@/components/dashboard/dashboard-card";

export function MoneyOutCard({ monthlySummary }: { monthlySummary: MonthlySummaryResponse | null }) {
  if (!monthlySummary) {
    return (
      <DashboardCard id="money-out" title="Money out">
        <CardBodySkeleton />
      </DashboardCard>
    );
  }

  const { currentMonth, previousMonth } = monthlySummary;
  // Spending less than last month is the good direction.
  const moneyOutSentiment = getTrendSentiment(
    currentMonth.moneyOutCents,
    previousMonth.moneyOutCents,
    false,
  );

  let spentPercent = 0;
  if (currentMonth.moneyInCents > 0) {
    spentPercent = Math.round((currentMonth.moneyOutCents / currentMonth.moneyInCents) * 100);
  } else if (currentMonth.moneyOutCents > 0) {
    spentPercent = 100;
  }

  return (
    <DashboardCard
      id="money-out"
      title="Money out"
      action={
        <TrendBadge
          differenceCents={currentMonth.moneyOutCents - previousMonth.moneyOutCents}
          sentiment={moneyOutSentiment}
        />
      }
    >
      <BigAmount amountCents={currentMonth.moneyOutCents} sentiment={moneyOutSentiment} />
      <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
        <span className="font-bold text-zinc-900 dark:text-zinc-50">{spentPercent}%</span> of this
        month&apos;s money in spent
      </p>

      <div className="mt-auto pt-6 text-xs">
        <p className="text-zinc-500 dark:text-zinc-400">Last month</p>
        <p className="font-bold tabular-nums text-zinc-900 dark:text-zinc-50">
          {formatWholeCurrency(previousMonth.moneyOutCents)}
        </p>
      </div>
    </DashboardCard>
  );
}
