import type { ReactNode } from "react";
import { formatSignedWholeCurrency, formatWholeCurrency, type Sentiment } from "@/lib/monthly-summary";
import { Skeleton } from "@/components/skeleton";

const SENTIMENT_TEXT_COLORS: Record<Sentiment, string> = {
  positive: "text-emerald-600 dark:text-emerald-400",
  negative: "text-red-600 dark:text-red-400",
  neutral: "text-zinc-900 dark:text-zinc-50",
};

const SENTIMENT_BADGE_COLORS: Record<Sentiment, string> = {
  positive: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  negative: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
  neutral: "bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
};

type DashboardCardProps = {
  id: string;
  title: string;
  action?: ReactNode;
  className?: string;
  children: ReactNode;
};

export function DashboardCard({ id, title, action, className = "", children }: DashboardCardProps) {
  return (
    <section
      id={id}
      aria-label={title}
      className={`flex min-w-0 scroll-mt-6 flex-col overflow-hidden rounded-2xl bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)] md:min-h-64 md:p-5 dark:bg-zinc-900 ${className}`}
    >
      {/* Wraps so the trend badge drops below the title on narrow mobile tiles. */}
      <header className="flex min-h-6 flex-wrap items-center justify-between gap-x-3 gap-y-1">
        <h2 className="text-xs font-bold text-zinc-900 dark:text-zinc-50">{title}</h2>
        {action}
      </header>
      <div className="mt-4 flex flex-1 flex-col">{children}</div>
    </section>
  );
}

type BigAmountProps = {
  amountCents: number;
  sentiment?: Sentiment;
};

export function BigAmount({ amountCents, sentiment = "neutral" }: BigAmountProps) {
  return (
    <p
      className={`text-3xl font-light tracking-tight md:text-5xl tabular-nums ${SENTIMENT_TEXT_COLORS[sentiment]}`}
    >
      {formatWholeCurrency(amountCents)}
    </p>
  );
}

type TrendBadgeProps = {
  differenceCents: number;
  sentiment: Sentiment;
};

// Small pill with the change vs last month, green when it's good news and red when it's bad.
export function TrendBadge({ differenceCents, sentiment }: TrendBadgeProps) {
  return (
    <span
      title="Compared with last month"
      className={`rounded-full px-2 py-0.5 text-[11px] font-bold tabular-nums ${SENTIMENT_BADGE_COLORS[sentiment]}`}
    >
      {formatSignedWholeCurrency(differenceCents)}
    </span>
  );
}

export function CardPill({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full border border-black/[.08] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:border-white/[.12] dark:text-zinc-400">
      {children}
    </span>
  );
}

export function CardBodySkeleton() {
  return (
    <div className="flex flex-1 flex-col gap-3">
      <Skeleton className="h-9 w-3/4 max-w-36 rounded-md md:h-12" />
      <Skeleton className="h-4 w-full max-w-44 rounded-md" />
      <Skeleton className="mt-auto h-16 rounded-xl md:h-24" />
    </div>
  );
}
