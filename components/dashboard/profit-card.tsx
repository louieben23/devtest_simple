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

const TICK_COUNT = 60;

type ProfitCardProps = {
  monthlySummary: MonthlySummaryResponse | null;
  className?: string;
};

// How much of this month's money in is kept as profit, shown as a tick slider.
export function ProfitCard({ monthlySummary, className }: ProfitCardProps) {
  if (!monthlySummary) {
    return (
      <DashboardCard id="profit" title="Profit" className={className}>
        <CardBodySkeleton />
      </DashboardCard>
    );
  }

  const { currentMonth, previousMonth } = monthlySummary;
  const profitSentiment = getTrendSentiment(currentMonth.profitCents, previousMonth.profitCents, true);

  const keptPercent =
    currentMonth.moneyInCents > 0
      ? Math.round((currentMonth.profitCents / currentMonth.moneyInCents) * 100)
      : 0;
  // A loss fills no ticks.
  const filledTickCount = Math.round((Math.min(Math.max(keptPercent, 0), 100) / 100) * TICK_COUNT);

  return (
    <DashboardCard
      id="profit"
      title="Profit"
      className={className}
      action={
        <TrendBadge
          differenceCents={currentMonth.profitCents - previousMonth.profitCents}
          sentiment={profitSentiment}
        />
      }
    >
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div className="flex items-start gap-5">
          <BigAmount amountCents={currentMonth.profitCents} sentiment={profitSentiment} />
          <p className="mt-2 max-w-32 text-xs text-zinc-500 dark:text-zinc-400">
            <span className="font-bold text-zinc-900 dark:text-zinc-50">{keptPercent}%</span> of this
            month&apos;s money in kept
          </p>
        </div>

        <dl className="grid grid-cols-[auto_auto] gap-x-4 gap-y-1 text-[11px] font-bold uppercase tracking-wider">
          <dt className="text-zinc-500 dark:text-zinc-400">Money in</dt>
          <dd className="tabular-nums text-zinc-900 dark:text-zinc-50">
            {formatWholeCurrency(currentMonth.moneyInCents)}
          </dd>
          <dt className="text-zinc-500 dark:text-zinc-400">Money out</dt>
          <dd className="tabular-nums text-zinc-900 dark:text-zinc-50">
            {formatWholeCurrency(currentMonth.moneyOutCents)}
          </dd>
          <dt className="text-zinc-500 dark:text-zinc-400">Last month</dt>
          <dd className="tabular-nums text-zinc-900 dark:text-zinc-50">
            {formatWholeCurrency(previousMonth.profitCents)}
          </dd>
        </dl>
      </div>

      <div className="mt-auto pt-6 md:pt-8">
        <div
          role="img"
          aria-label={`${keptPercent}% of this month's money in kept as profit`}
          className="flex h-12 items-end justify-between md:h-16"
        >
          {Array.from({ length: TICK_COUNT }, (_, tickIndex) => {
            const isMarker = filledTickCount > 0 && tickIndex === filledTickCount - 1;
            const tickClasses = isMarker
              ? "h-full w-0.5 bg-orange-600"
              : tickIndex < filledTickCount
                ? "h-3/4 w-px bg-orange-400"
                : "h-3/4 w-px bg-zinc-300 dark:bg-zinc-700";

            return <div key={tickIndex} className={tickClasses} />;
          })}
        </div>

        <div className="mt-2 flex justify-between text-[10px] tabular-nums text-zinc-400">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>
      </div>
    </DashboardCard>
  );
}
