"use client";

import { useState } from "react";
import { formatWholeCurrency } from "@/lib/monthly-summary";
import type { JobsResponse } from "@/lib/jobs";
import { CheckIcon } from "@/components/dashboard/dashboard-icons";

type CurrentJobSectionProps = {
  jobsResponse: JobsResponse | null;
  onJobDone: (jobId: string) => Promise<void>;
};

// The job being worked on now, shown beside the icon rail, with a big "Job Done" hero button.
export function CurrentJobSection({ jobsResponse, onJobDone }: CurrentJobSectionProps) {
  const [isSaving, setIsSaving] = useState(false);
  // Stays set until the jobs reload and the next job takes its place, so it can't be pressed twice.
  const [completedJobId, setCompletedJobId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!jobsResponse) {
    return (
      <div className="flex min-w-0 flex-1 flex-col gap-3 max-lg:justify-center">
        <div className="h-3 w-24 animate-pulse rounded-md bg-zinc-200/70 dark:bg-zinc-800" />
        <div className="h-14 w-56 animate-pulse rounded-md bg-zinc-200/70 lg:h-10 lg:w-40 dark:bg-zinc-800" />
        <div className="h-5 w-full animate-pulse rounded-md bg-zinc-200/70 lg:h-4 dark:bg-zinc-800" />
        <div className="mt-2 h-48 animate-pulse lg:h-40 rounded-2xl bg-zinc-200/70 dark:bg-zinc-800" />
      </div>
    );
  }

  const { currentJob } = jobsResponse;

  if (!currentJob) {
    return (
      <section id="current-job" aria-label="Current Job" className="min-w-0 flex-1">
        <SectionLabel />
        <h2 className="mt-2 text-5xl font-light lg:text-4xl tracking-tight text-zinc-900 dark:text-zinc-50">
          All done
        </h2>
        <p className="mt-2 text-lg text-zinc-500 lg:text-xs dark:text-zinc-400">
          No jobs left in the queue. Nice work.
        </p>
      </section>
    );
  }

  const isDone = currentJob.id === completedJobId;

  async function handleJobDone(jobId: string) {
    setIsSaving(true);
    setErrorMessage(null);
    try {
      await onJobDone(jobId);
      setCompletedJobId(jobId);
    } catch (error: unknown) {
      setErrorMessage(error instanceof Error ? error.message : "Couldn't mark the job as done.");
    } finally {
      setIsSaving(false);
    }
  }

  let buttonLabel = "Job Done";
  if (isSaving) buttonLabel = "Saving…";
  if (isDone) buttonLabel = "Paid";

  return (
    <section id="current-job" aria-label="Current Job" className="flex min-w-0 flex-1 flex-col">
      {/* Larger on mobile, where the current job is the full screen hero,
          and centered in the space above the "Job Done" button. */}
      <div className="flex flex-col max-lg:flex-1 max-lg:justify-center">
        <SectionLabel />
        <h2 className="mt-2 break-words text-6xl font-light tracking-tight text-zinc-900 lg:text-4xl dark:text-zinc-50">
          {currentJob.title}
        </h2>
        <p className="mt-2 text-lg font-bold text-zinc-900 lg:mt-1 lg:text-sm dark:text-zinc-50">
          {currentJob.customer}
        </p>
        <p className="mt-3 text-lg leading-relaxed text-zinc-500 lg:mt-2 lg:text-xs lg:leading-normal dark:text-zinc-400">
          {currentJob.description}
        </p>
        <p className="mt-6 text-5xl font-light tracking-tight tabular-nums text-zinc-900 lg:mt-4 lg:text-3xl dark:text-zinc-50">
          {formatWholeCurrency(currentJob.priceCents)}
        </p>
      </div>

      <button
        type="button"
        onClick={() => handleJobDone(currentJob.id)}
        disabled={isSaving || isDone}
        className={`mt-5 flex min-h-48 w-full lg:min-h-40 flex-col justify-between rounded-2xl p-5 text-left text-white transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500 disabled:cursor-default ${
          isDone
            ? "bg-emerald-600"
            : "bg-linear-to-br from-orange-500 to-orange-600 shadow-lg shadow-orange-500/25 hover:from-orange-600 hover:to-orange-700 active:scale-[0.98] disabled:opacity-80"
        }`}
      >
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/20">
          <CheckIcon />
        </span>
        <span>
          <span className="block text-4xl font-light tracking-tight lg:text-3xl">{buttonLabel}</span>
          <span className="mt-1 block text-xs text-white/80">
            {isDone
              ? `${formatWholeCurrency(currentJob.priceCents)} added to money in`
              : `Adds ${formatWholeCurrency(currentJob.priceCents)} to money in`}
          </span>
        </span>
      </button>

      {errorMessage && (
        <p role="alert" className="mt-3 text-xs text-red-600 dark:text-red-400">
          {errorMessage}
        </p>
      )}
    </section>
  );
}

function SectionLabel() {
  return (
    <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
      <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
      Current Job
    </p>
  );
}
