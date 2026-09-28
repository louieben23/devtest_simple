import {
  formatCurrency,
  getTrendSentiment,
  type MonthlySummaryResponse,
} from "@/lib/monthly-summary";
import {
  formatDayOfMonth,
  getDailyTotalsCents,
  type TransactionsResponse,
} from "@/lib/transactions";
import {
  BigAmount,
  CardBodySkeleton,
  DashboardCard,
  TrendBadge,
} from "@/components/dashboard/dashboard-card";

// Days without income still get a short stub so the month's shape stays visible.
const MINIMUM_BAR_HEIGHT_PERCENT = 4;

type MoneyInCardProps = {
  monthlySummary: MonthlySummaryResponse | null;
  transactionsResponse: TransactionsResponse | null;
};

export function MoneyInCard({ monthlySummary, transactionsResponse }: MoneyInCardProps) {
  if (!monthlySummary || !transactionsResponse) {
    return (
      <DashboardCard id="money-in" title="Money in">
        <CardBodySkeleton />
      </DashboardCard>
    );
  }

  const { currentMonth, previousMonth } = monthlySummary;
  const { monthStart, daysInMonth, transactions } = transactionsResponse;
  const moneyInSentiment = getTrendSentiment(
    currentMonth.moneyInCents,
    previousMonth.moneyInCents,
    true,
  );

  const dailyIncomeCents = getDailyTotalsCents(transactions, "income", daysInMonth);
  const highestDailyIncomeCents = Math.max(...dailyIncomeCents);
  const highestDayIndex = dailyIncomeCents.indexOf(highestDailyIncomeCents);

  return (
    <DashboardCard
      id="money-in"
      title="Money in"
      action={
        <TrendBadge
          differenceCents={currentMonth.moneyInCents - previousMonth.moneyInCents}
          sentiment={moneyInSentiment}
        />
      }
    >
      <BigAmount amountCents={currentMonth.moneyInCents} sentiment={moneyInSentiment} />

      <div className="mt-auto pt-6">
        <p className="mb-3 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
          {highestDailyIncomeCents > 0
            ? `Best day: ${formatDayOfMonth(monthStart, highestDayIndex)} · ${formatCurrency(highestDailyIncomeCents)}`
            : "No income yet"}
        </p>

        <div
          role="img"
          aria-label="Money in for each day of this month"
          className="flex h-16 items-end justify-between md:h-24"
        >
          {dailyIncomeCents.map((amountCents, dayIndex) => {
            const heightPercent =
              highestDailyIncomeCents > 0
                ? Math.max((amountCents / highestDailyIncomeCents) * 100, MINIMUM_BAR_HEIGHT_PERCENT)
                : MINIMUM_BAR_HEIGHT_PERCENT;
            const barColor =
              amountCents > 0 && dayIndex === highestDayIndex
                ? "bg-orange-500"
                : amountCents > 0
                  ? "bg-zinc-800 dark:bg-zinc-200"
                  : "bg-zinc-300 dark:bg-zinc-700";

            return (
              <div
                key={dayIndex}
                title={`Day ${dayIndex + 1}: ${formatCurrency(amountCents)}`}
                // Thinner bars on mobile so a whole month fits in a half width tile.
                className={`w-0.5 rounded-full md:w-1 ${barColor}`}
                style={{ height: `${heightPercent}%` }}
              />
            );
          })}
        </div>

        <div className="mt-2 flex justify-between text-[10px] tabular-nums text-zinc-400">
          <span>1</span>
          <span>{Math.ceil(daysInMonth / 2)}</span>
          <span>{daysInMonth}</span>
        </div>
      </div>
    </DashboardCard>
  );
}
