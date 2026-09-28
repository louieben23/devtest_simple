# Changelog

## [0.7.0] - 2026-09-28

### Added

- None.

### Updated

- `components/dashboard/dashboard-panel.tsx` — New card order: Profit (two columns wide) and Money in on top; Next Job, Money out and Top spending below.
- `components/dashboard/profit-card.tsx` — Profit is now the wide card with the tick slider, showing how much of this month's money in was kept as profit, plus money in, money out and last month's profit. The sun shape is removed.
- `components/dashboard/money-out-card.tsx` — Money out is now the small card: amount, share of money in spent, and last month's money out.
- `components/dashboard/money-in-card.tsx` — The money in amount is colored like the other amounts.
- `lib/monthly-summary.ts` — Removed `getProfitSentiment`; all amounts now use `getTrendSentiment`.

### Bug Fixes

- Amount colors now follow one rule: green when the number improved on last month (money in or profit up, money out down), red when it got worse, black when unchanged. Previously only profit was colored, and by whether it was positive rather than by its trend.

## [0.6.1] - 2026-09-28

### Added

- None.

### Updated

- `components/dashboard/dashboard-panel.tsx` — Removed the icon rail beside the current job. Sign out moved to a small "Sign out" text button under the greeting, so it isn't lost. The left column is back to 16rem now that the rail is gone.
- `components/dashboard/dashboard-icons.tsx` — Removed `OverviewIcon` and `InfoIcon`; `SignOutIcon` is smaller (14px) to sit next to the "Sign out" text.
- Removed `components/dashboard/dashboard-rail.tsx`.

### Bug Fixes

- None.

## [0.6.0] - 2026-09-28

### Added

- `components/dashboard/current-job-section.tsx` — The current job now sits in the left column beside the icon rail: "Current Job" label, job title, customer, description, price and the orange "Job Done" hero button (turns green "Paid" once saved). Shows "All done" when no jobs are left.

### Updated

- `components/dashboard/dashboard-panel.tsx` — Now a client component that loads jobs, the monthly summary and transactions with `useAPI`, and lays out the clock, icon rail and current job on the left and the cards on the right. The "Overview" title, month label and jump links were removed. The left column is wider (18rem) to fit the hero button. Card order: Next Job, Profit, Money in, then Money out (two columns wide) and Top spending.
- `app/page.tsx` — `DashboardPanel` only needs `firstName` now; the month label is no longer passed.
- Removed `components/dashboard/current-job-card.tsx` (replaced by the current job section) and `components/dashboard/dashboard-cards.tsx` (merged into `dashboard-panel.tsx`).

### Bug Fixes

- None.

## [0.5.1] - 2026-09-28

### Added

- None.

### Updated

- `supabase/seed.sql` — The sample jobs section is now one statement: it removes the old sample jobs and the money in from any that were marked done, then adds fresh sample jobs.

### Bug Fixes

- `supabase/seed.sql` — Fixed `relation "sample_jobs" does not exist` when running the seed in the Supabase SQL Editor. The editor doesn't keep a temporary table between statements, so the sample job list is now a `with` query inside the single statement instead of a temporary table.

## [0.5.0] - 2026-09-28

### Added

- `supabase/migrations/20260928020000_create_jobs.sql` — `jobs` table (customer, title, description, price in cents, pending / done, queue position) with row level security so users only see their own jobs, plus a `complete_job(job_id)` database function that marks a pending job done and adds its price as a money in transaction in one step, so a job can't be paid twice.
- `app/api/jobs/route.ts` — `GET /api/jobs` returns the current job (first pending job in the queue) and the next jobs. `PATCH /api/jobs` with `{ jobId, status: "done" }` marks the job done and adds its price to money in.
- `lib/jobs.ts` — `JobItem` and `JobsResponse` types.
- `components/dashboard/next-job-card.tsx` — "Next Job" card listing the queued jobs with job title, customer and price.
- `components/dashboard/current-job-card.tsx` — "Current Job" card (two columns wide) with the customer, job title, description and price, and a large orange "Job Done" hero button that fills most of the card. It turns green ("Paid") once saved and can't be pressed twice; the next job then takes its place.
- `supabase/seed.sql` — Sample jobs for every signed-up user: "BUILD IT" for Angus Shield ($1,000) as the current job, plus four next jobs. Running it again replaces the sample jobs and removes the money in from any sample job marked done.
- `components/dashboard/dashboard-icons.tsx` — `CheckIcon`.

### Updated

- `hooks/use-api.ts` — `useAPI` now also returns `refetch` (reloads while keeping the current data on screen) and `sendRequest(method, body)` (sends a POST / PATCH / DELETE to the same url, then reloads).
- `components/dashboard/dashboard-cards.tsx` — Loads `/api/jobs` too. Pressing "Job Done" sends the update and then reloads money in, profit, money out and the daily chart straight away, without refreshing the page. New order: Next Job, Current Job, then Profit, Money in, Top spending, then Money out across the full width.
- `components/dashboard/dashboard-panel.tsx` — Removed the panel's white background, border, shadow and padding so the dashboard sits directly on the page background. Jump links now include Next Job and Current Job.
- `components/dashboard/dashboard-card.tsx` — Cards are white with a faint shadow, so they stand out from the page background.
- `components/dashboard/dashboard-rail.tsx` — Icon rail is a white pill without a border, matching the cards.
- Removed `components/dashboard/recent-activity-card.tsx`; the Next Job card replaces it.

### Bug Fixes

- None.

## [0.4.0] - 2026-09-28

### Added

- `app/api/transactions/route.ts` — `GET /api/transactions` returns this month's transactions (newest first), the month start date and the number of days in the month (UTC calendar months).
- `lib/transactions.ts` — Transaction response types, short date formatting, per-day totals and the "top spending" grouping by description.
- `components/dashboard/dashboard-panel.tsx` — New dashboard layout: a large rounded panel with the clock and greeting, the icon rail and an "Overview" title with faded jump links to each card on the left, and the card grid on the right.
- `components/dashboard/dashboard-cards.tsx` — Client component that loads `/api/monthly-summary` and `/api/transactions` with `useAPI` and lays out the five cards, with an error message if either request fails.
- `components/dashboard/dashboard-card.tsx` — Shared `DashboardCard` shell plus `BigAmount`, `TrendBadge` (green / red change vs last month), `CardPill` and `CardBodySkeleton`.
- `components/dashboard/dashboard-clock.tsx` — Live local time and a "Good morning / afternoon / evening" greeting, shown only in the browser so it uses the visitor's time zone.
- `components/dashboard/dashboard-rail.tsx` — Vertical icon pill with Overview, About, See on GitHub and Sign out.
- `components/dashboard/dashboard-icons.tsx` — Overview, info and sign out icons.
- `components/dashboard/recent-activity-card.tsx` — Latest five transactions with date, direction and signed amount.
- `components/dashboard/profit-card.tsx` — Profit with money in / out, last month's profit and a warm glow along the bottom.
- `components/dashboard/money-in-card.tsx` — Money in with a thin bar per day of the month; the best day is highlighted in orange.
- `components/dashboard/money-out-card.tsx` — Money out (two columns wide) with a tick slider showing how much of this month's money in has been spent.
- `components/dashboard/top-spending-card.tsx` — Share of spending taken by the biggest expense, plus horizontal bars for the top five expenses.

### Updated

- `app/page.tsx` — Replaced the "This month" heading, sign out button and three stat cards with the new `DashboardPanel`. Sign out now lives in the icon rail.
- `lib/monthly-summary.ts` — Added `formatWholeCurrency`, `formatSignedWholeCurrency`, `getUtcMonthStart`, `toISODateString` and `formatMonthLabel`.
- `app/api/monthly-summary/route.ts` — Uses the shared month helpers from `lib/monthly-summary.ts` instead of its own date code.
- Removed `components/dashboard/monthly-summary.tsx` and `components/dashboard/stat-card.tsx`; the new cards replace them.

### Bug Fixes

- None.

## [0.3.2] - 2026-09-28

### Added

- `supabase/seed.sql` — Sample income and expense transactions for last month and this month, added for every signed-up user, so the dashboard shows green (money in up, profit positive) and red (money out up) numbers. Sample rows start with `[Sample]` and are replaced, not duplicated, when the script runs again.

### Updated

- None.

### Bug Fixes

- None.

## [0.3.1] - 2026-09-28

### Added

- None.

### Updated

- `app/layout.tsx` — Replaced the Geist and Geist Mono fonts with Lato (weights 300, 400, 700 and 900) loaded through `next/font/google`.
- `app/globals.css` — The page body and Tailwind's `font-sans` now use Lato.

### Bug Fixes

- None.

## [0.3.0] - 2026-09-28

### Added

- `supabase/migrations/20260928010000_create_transactions.sql` — `transactions` table (income / expense, amount stored in cents) with row level security so users only see their own rows, plus a `get_monthly_totals(month_start)` database function that sums a month's money in and money out.
- `app/api/monthly-summary/route.ts` — `GET /api/monthly-summary` returns money in, money out and profit for this month and last month (UTC calendar months).
- `hooks/use-api.ts` — `useAPI` hook for fetching JSON from the app's API routes, with `data`, `error` and `isLoading`.
- `lib/monthly-summary.ts` — Shared response types, USD currency formatting and the green / red sentiment rules.
- `components/dashboard/monthly-summary.tsx` — Client component that loads the monthly summary with `useAPI` and shows three big numbers in a hairline-divided panel, with a loading skeleton and an error message.
- `components/dashboard/stat-card.tsx` — `StatCard` (label, big number, difference vs last month) and `StatCardSkeleton`. Money in is green when it went up, money out is green when it went down, profit is green when positive; red for the opposite, black when unchanged.
- `components/site-footer.tsx` — Shared "SIMPLE by Louie Casapao" footer with the GitHub link.

### Updated

- `app/page.tsx` — Replaced the placeholder profile card with the dashboard: site header, "Welcome back" greeting, "This month" title, sign out button, the monthly summary and the footer.
- `app/login/page.tsx` — Uses the shared `SiteFooter` instead of its own footer markup.

### Bug Fixes

- None.

## [0.2.0] - 2026-09-28

### Added

- `components/site-header.tsx` — Borderless header with the "Angus Shield" text logo on the left (bold black "A", bold warm red "S") and an "About" text button plus a "See on GitHub" action button on the right.
- `components/github-icon.tsx` — Shared `GitHubIcon` component and `GITHUB_REPOSITORY_URL` constant.

### Updated

- `app/login/page.tsx` — Added the `SiteHeader` at the top of the login page. The footer now uses the shared `GitHubIcon` and `GITHUB_REPOSITORY_URL` instead of its own copies.

### Bug Fixes

- None.

## [0.1.0] - 2026-09-28

### Added

- "SIMPLE by Louie Casapao" footer at the bottom of the login page.
- GitHub icon link to the repository (https://github.com/louieben23/devtest_simple) in the login page footer.
- `GitHubIcon` component in `app/login/page.tsx`.

### Updated

- `app/login/page.tsx` — Changed the page layout to a column so the sign-in content stays centered and the footer sits at the bottom.

### Bug Fixes

- None.
