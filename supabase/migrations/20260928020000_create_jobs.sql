-- Jobs waiting to be done for each user. The first pending job (lowest queue_position)
-- is the current job; the rest are next up. Prices are stored in cents.

create table public.jobs (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null default auth.uid() references auth.users (id) on delete cascade,
  customer        text not null,
  title           text not null,
  description     text,
  price_cents     bigint not null check (price_cents > 0),
  status          text not null default 'pending' check (status in ('pending', 'done')),
  queue_position  integer not null default 0,
  completed_at    timestamptz,
  -- The money in transaction created when the job was marked done.
  transaction_id  uuid references public.transactions (id) on delete set null,
  created_at      timestamptz not null default now()
);

create index jobs_user_id_status_queue_position_idx
  on public.jobs (user_id, status, queue_position);

alter table public.jobs enable row level security;

create policy "Users can view their own jobs"
  on public.jobs for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can insert their own jobs"
  on public.jobs for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can update their own jobs"
  on public.jobs for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Users can delete their own jobs"
  on public.jobs for delete
  to authenticated
  using ((select auth.uid()) = user_id);

-- Marks one of the caller's pending jobs as done and records its price as money in, together,
-- so a job can never be paid twice or marked done without its transaction.
-- Raises no_data_found (P0002) when the job doesn't exist or is already done.
create function public.complete_job(job_id uuid)
returns uuid
language plpgsql
security invoker
set search_path = ''
as $$
declare
  completed_job public.jobs;
  new_transaction_id uuid;
begin
  update public.jobs
  set status = 'done', completed_at = now()
  where id = job_id
    and status = 'pending'
    and user_id = (select auth.uid())
  returning * into completed_job;

  if not found then
    raise exception 'Job not found or already done.' using errcode = 'P0002';
  end if;

  insert into public.transactions (user_id, type, amount_cents, description, occurred_on)
  values (
    completed_job.user_id,
    'income',
    completed_job.price_cents,
    completed_job.title || ' — ' || completed_job.customer,
    current_date
  )
  returning id into new_transaction_id;

  update public.jobs
  set transaction_id = new_transaction_id
  where id = job_id;

  return new_transaction_id;
end;
$$;
