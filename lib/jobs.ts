export type JobItem = {
  id: string;
  customer: string;
  title: string;
  description: string;
  priceCents: number;
};

export type JobsResponse = {
  currentJob: JobItem | null;
  nextJobs: JobItem[];
};
