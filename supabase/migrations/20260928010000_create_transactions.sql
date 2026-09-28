-- Money in (income) and money out (expense) records for each user.
-- Amounts are stored in cents to avoid floating point rounding errors.

create table public.transactions (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null default auth.uid() references auth.users (id) on delete cascade,
  type          text not null check (type in ('income', 'expense')),
  amount_cents  bigint not null check (amount_cents > 0),
  description   text,
  occurred_on   date not null default current_date,
  created_at    timestamptz not null default now()
);

create index transactions_user_id_occurred_on_idx
  on public.transactions (user_id, occurred_on);

alter table public.transactions enable row level security;

create policy "Users can view their own transactions"
  on public.transactions for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can insert their own transactions"
  on public.transactions for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can update their own transactions"
  on public.transactions for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Users can delete their own transactions"
  on public.transactions for delete
  to authenticated
  using ((select auth.uid()) = user_id);

-- Totals for the calendar month starting at month_start, for the calling user.
-- Summed in the database so the result is never cut off by the API row limit.
create function public.get_monthly_totals(month_start date)
returns table (money_in_cents bigint, money_out_cents bigint)
language sql
stable
security invoker
set search_path = ''
as $$
  select
    coalesce(sum(amount_cents) filter (where type = 'income'), 0)::bigint,
    coalesce(sum(amount_cents) filter (where type = 'expense'), 0)::bigint
  from public.transactions
  where user_id = (select auth.uid())
    and occurred_on >= month_start
    and occurred_on < (month_start + interval '1 month')::date;
$$;
