import { formatWholeCurrency } from "@/lib/monthly-summary";
import type { JobItem } from "@/lib/jobs";
import { CardBodySkeleton, CardPill, DashboardCard } from "@/components/dashboard/dashboard-card";

const VISIBLE_JOB_COUNT = 5;

export function NextJobCard({ nextJobs }: { nextJobs: JobItem[] | null }) {
  return (
    <DashboardCard
      id="next-job"
      title="Next Job"
      action={nextJobs && <CardPill>{nextJobs.length} queued</CardPill>}
    >
      {!nextJobs ? (
        <CardBodySkeleton />
      ) : nextJobs.length === 0 ? (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Nothing else in the queue.</p>
      ) : (
        <ul className="-mt-2 divide-y divide-black/[.06] dark:divide-white/[.08]">
          {nextJobs.slice(0, VISIBLE_JOB_COUNT).map((job) => (
            <li key={job.id} className="flex items-center justify-between gap-3 py-2.5">
              <div className="min-w-0">
                <p className="truncate text-xs font-bold text-zinc-900 dark:text-zinc-50">
                  {job.title}
                </p>
                <p className="truncate text-[11px] text-zinc-500 dark:text-zinc-400">
                  {job.customer}
                </p>
              </div>
              <p className="shrink-0 text-xs font-bold tabular-nums text-zinc-900 dark:text-zinc-50">
                {formatWholeCurrency(job.priceCents)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </DashboardCard>
  );
}
