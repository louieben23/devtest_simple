import type { ReactNode } from "react";
import { formatSignedWholeCurrency, formatWholeCurrency, type Sentiment } from "@/lib/monthly-summary";

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
      className={`flex min-h-64 scroll-mt-6 flex-col overflow-hidden rounded-2xl bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)] dark:bg-zinc-900 ${className}`}
    >
      <header className="flex min-h-6 items-center justify-between gap-3">
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
      className={`text-5xl font-light tracking-tight tabular-nums ${SENTIMENT_TEXT_COLORS[sentiment]}`}
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
      <div className="h-12 w-36 animate-pulse rounded-md bg-zinc-200/70 dark:bg-zinc-800" />
      <div className="h-4 w-44 animate-pulse rounded-md bg-zinc-200/70 dark:bg-zinc-800" />
      <div className="mt-auto h-24 animate-pulse rounded-xl bg-zinc-200/70 dark:bg-zinc-800" />
    </div>
  );
}
