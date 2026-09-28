-- Sample transactions so the dashboard shows both green and red numbers.
-- Run it in Supabase Dashboard → SQL Editor after signing in to the app at least once.
-- Every signed-up user gets the sample rows. Running it again replaces them instead of adding duplicates.
--
-- Last month: money in $5,000.00, money out $2,200.00
-- This month: money in $6,500.00 (up → green), money out $3,400.00 (up → red), profit $3,100.00 (positive → green)
--
-- Sample jobs: "BUILD IT" for Angus Shield is the current job, the other four are next up.
-- Running it again also removes the money in added by marking those sample jobs done.

delete from public.transactions
where description like '[Sample]%';

with
  months as (
    select
      date_trunc('month', current_date)::date as current_month_start,
      (date_trunc('month', current_date) - interval '1 month')::date as previous_month_start
  ),
  sample_transactions (type, amount_cents, description, month, day_offset) as (
    values
      -- Last month
      ('income',  420000, '[Sample] Salary',             'previous', 0),
      ('income',   80000, '[Sample] Freelance project',  'previous', 14),
      ('expense', 150000, '[Sample] Rent',               'previous', 1),
      ('expense',  40000, '[Sample] Groceries',          'previous', 9),
      ('expense',  30000, '[Sample] Utilities',          'previous', 19),
      -- This month
      ('income',  520000, '[Sample] Salary',             'current',  0),
      ('income',  130000, '[Sample] Freelance project',  'current',  0),
      ('expense', 150000, '[Sample] Rent',               'current',  0),
      ('expense',  65000, '[Sample] Groceries',          'current',  0),
      ('expense',  35000, '[Sample] Utilities',          'current',  0),
      ('expense',  90000, '[Sample] New laptop',         'current',  0)
  )
insert into public.transactions (user_id, type, amount_cents, description, occurred_on)
select
  users.id,
  sample_transactions.type,
  sample_transactions.amount_cents,
  sample_transactions.description,
  case sample_transactions.month
    when 'current' then months.current_month_start + sample_transactions.day_offset
    else months.previous_month_start + sample_transactions.day_offset
  end
from auth.users as users
cross join months
cross join sample_transactions;

-- Sample jobs. One statement, so the same list is used to clean up and to insert:
-- old sample jobs are removed, then the money in from any that were marked done, then fresh jobs are added.
with
  sample_jobs (customer, title, description, price_cents, queue_position) as (
    values
      ('Angus Shield',     'BUILD IT',       'Build a mini "One Login" app. Next.js + Supabase, deployed live on Vercel.', 100000, 1),
      ('Northwind Cafe',   'MENU SITE',      'Refresh the menu page and add online ordering links.',                        65000, 2),
      ('Bluepeak Fitness', 'CLASS BOOKING',  'Let members book and cancel classes from their phone.',                      140000, 3),
      ('Harbor Dental',    'INTAKE FORM',    'Replace the paper patient form with a secure online form.',                   48000, 4),
      ('Lumen Studio',     'PORTFOLIO CMS',  'Let the team add projects to their portfolio without code.',                  90000, 5)
  ),
  deleted_sample_jobs as (
    delete from public.jobs
    using sample_jobs
    where jobs.customer = sample_jobs.customer
      and jobs.title = sample_jobs.title
    returning jobs.transaction_id
  ),
  deleted_sample_job_transactions as (
    delete from public.transactions
    where id in (select transaction_id from deleted_sample_jobs)
  )
insert into public.jobs (user_id, customer, title, description, price_cents, queue_position)
select
  users.id,
  sample_jobs.customer,
  sample_jobs.title,
  sample_jobs.description,
  sample_jobs.price_cents,
  sample_jobs.queue_position
from auth.users as users
cross join sample_jobs;
