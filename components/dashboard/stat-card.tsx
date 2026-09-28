import { formatCurrency, formatSignedCurrency, type Sentiment } from "@/lib/monthly-summary";

const SENTIMENT_TEXT_COLORS: Record<Sentiment, string> = {
  positive: "text-emerald-600 dark:text-emerald-400",
  negative: "text-red-600 dark:text-red-400",
  neutral: "text-black dark:text-zinc-50",
};

type StatCardProps = {
  label: string;
  amountCents: number;
  previousAmountCents: number;
  sentiment: Sentiment;
};

export function StatCard({ label, amountCents, previousAmountCents, sentiment }: StatCardProps) {
  return (
    <div className="flex flex-col gap-3 bg-white p-8 dark:bg-zinc-950">
      <p className="text-xs uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
        {label}
      </p>
      <p
        className={`text-4xl font-semibold tracking-tight tabular-nums ${SENTIMENT_TEXT_COLORS[sentiment]}`}
      >
        {formatCurrency(amountCents)}
      </p>
      <p className="text-sm tabular-nums text-zinc-500 dark:text-zinc-400">
        {formatSignedCurrency(amountCents - previousAmountCents)} vs last month
      </p>
    </div>
  );
}

export function StatCardSkeleton({ label }: { label: string }) {
  return (
    <div className="flex flex-col gap-3 bg-white p-8 dark:bg-zinc-950">
      <p className="text-xs uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
        {label}
      </p>
      <div className="h-10 w-40 animate-pulse rounded-md bg-zinc-100 dark:bg-zinc-800" />
      <div className="h-5 w-32 animate-pulse rounded-md bg-zinc-100 dark:bg-zinc-800" />
    </div>
  );
}
