import { createClient } from "@/lib/supabase/server";
import type { JobItem, JobsResponse } from "@/lib/jobs";

type JobRow = {
  id: string;
  customer: string;
  title: string;
  description: string | null;
  price_cents: number;
};

type CompleteJobRequest = {
  jobId: string;
  status: "done";
};

function isCompleteJobRequest(requestBody: unknown): requestBody is CompleteJobRequest {
  if (typeof requestBody !== "object" || requestBody === null) return false;
  const { jobId, status } = requestBody as Record<string, unknown>;
  return typeof jobId === "string" && status === "done";
}

// The signed-in user's pending jobs: the first in the queue is the current job, the rest are next up.
export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return Response.json({ error: "Not signed in." }, { status: 401 });
  }

  // RLS ensures this only returns the caller's own rows.
  const { data, error } = await supabase
    .from("jobs")
    .select("id, customer, title, description, price_cents")
    .eq("status", "pending")
    .order("queue_position", { ascending: true })
    .order("created_at", { ascending: true })
    .overrideTypes<JobRow[], { merge: false }>();

  if (error) {
    return Response.json({ error: "Couldn't load your jobs." }, { status: 500 });
  }

  const jobs: JobItem[] = data.map((row) => ({
    id: row.id,
    customer: row.customer,
    title: row.title,
    description: row.description ?? "",
    priceCents: Number(row.price_cents),
  }));

  const [currentJob = null, ...nextJobs] = jobs;
  const jobsResponse: JobsResponse = { currentJob, nextJobs };
  return Response.json(jobsResponse);
}

// Marks a job as done: body { jobId, status: "done" }. Its price is added to money in.
export async function PATCH(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return Response.json({ error: "Not signed in." }, { status: 401 });
  }

  const requestBody: unknown = await request.json().catch(() => null);
  if (!isCompleteJobRequest(requestBody)) {
    return Response.json({ error: 'Send a jobId with status "done".' }, { status: 400 });
  }

  const { error } = await supabase.rpc("complete_job", { job_id: requestBody.jobId });

  if (error?.code === "P0002") {
    return Response.json({ error: "This job is already done." }, { status: 409 });
  }
  if (error) {
    return Response.json({ error: "Couldn't mark the job as done." }, { status: 500 });
  }

  return Response.json({ jobId: requestBody.jobId });
}
