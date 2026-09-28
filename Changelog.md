# Changelog

## [0.10.0] - 2026-09-28

### Added

- `components/mobile-sidebar.tsx` — `MobileSidebar`: on mobile (below the `lg` breakpoint) a menu button opens a sidebar that slides in from the left, with "About" and the "See on GitHub" button. It closes from the close button, by tapping outside it, with Escape, when a link is picked, or when the screen widens to desktop. While it's open, the page behind it doesn't scroll. The slide is off for visitors who prefer reduced motion.

### Updated

- `components/site-header.tsx` — On mobile the "About" and "See on GitHub" links are hidden and moved into `MobileSidebar`, with the menu button on the left and the "Angus Shield" logo centered. The header height is unchanged. The desktop header is unchanged.

### Bug Fixes

- None.

## [0.9.1] - 2026-09-28

### Added

- None.

### Updated

- `components/dashboard/current-job-section.tsx` — Smaller current job on mobile so the whole hero fits on a phone screen: the title and price are `text-4xl`, the customer and description are `text-base`, the spacing is tighter, and the "Job Done" button is shorter (`min-h-32`) with a smaller check icon. The loading placeholder matches. Desktop sizes are unchanged.
- `components/dashboard/parallax-hero.tsx` — Smaller gap between the clock row and the current job, and a more compact "Scroll for Stats" indicator on mobile.
- `components/dashboard/dashboard-skeleton.tsx` — The hero gap and the "Scroll for Stats" placeholder match the new mobile spacing.

### Bug Fixes

- `components/dashboard/parallax-hero.tsx` — On short phone screens, the bottom of the mobile hero (the "Job Done" button and "Scroll for Stats") couldn't be seen. The hero was taller than the screen, and the first swipe jumped straight to the stats. Now, when the hero doesn't fit, it scrolls normally until its end is on screen, and only then does a swipe or scroll open the stats. The parallax drift also waits until then, so it doesn't push the button down out of reach.

## [0.9.0] - 2026-09-28

### Added

- `components/skeleton.tsx` — `Skeleton`: a shared pulsing placeholder block, sized with `className`. The pulse stops for visitors who prefer reduced motion, and screen readers skip it.
- `components/dashboard/dashboard-skeleton.tsx` — `DashboardSkeleton`: a full dashboard loading skeleton with the same layout as the dashboard. It includes the clock and greeting, the current job, the "Scroll for Stats" indicator on mobile, and all five cards. The cards are the real cards in their loading state, so nothing jumps when the dashboard arrives. It announces "Loading your dashboard…" to screen readers.
- `components/dashboard/dashboard-layout.ts` — `DASHBOARD_GRID_CLASS_NAME` and `STATS_GRID_CLASS_NAME`, shared by the dashboard and its skeleton so the two layouts stay in sync.

### Updated

- `app/page.tsx` — The page no longer waits for the sign-in check and profile before showing anything. The header and footer show straight away, and `DashboardSkeleton` fills the page until the new `SignedInDashboard` component has loaded the user. The sign-in check and redirect are unchanged.
- `components/dashboard/current-job-section.tsx` — The loading placeholder is now `CurrentJobSkeleton`, built with `Skeleton`. It is shaped like the current job: the "Current Job" label, title, customer, description, price and the "Job Done" button.
- `components/dashboard/dashboard-card.tsx` — `CardBodySkeleton` uses `Skeleton`. It looks the same as before.
- `components/dashboard/dashboard-panel.tsx` — Uses the shared layout classes from `dashboard-layout.ts`. The layout is unchanged.

### Bug Fixes

- The dashboard was blank until the server had checked who was signed in. The loading skeleton now shows during that wait.

## [0.8.3] - 2026-09-28

### Added

- None.

### Updated

- `components/dashboard/parallax-hero.tsx` — On mobile, one swipe up (or one scroll down with a mouse wheel or trackpad) while the current job hero is showing smoothly scrolls straight to the stats. The browser's own scrolling is paused during that scroll so it can't interrupt it. Once the stats are open, scrolling works normally, and scrolling back up to the hero is unchanged. Desktop scrolling is unchanged. The "Scroll for Stats" link and the swipe share one `scrollToSection` helper.

### Bug Fixes

- None.

## [0.8.2] - 2026-09-28

### Added

- None.

### Updated

- `components/dashboard/current-job-section.tsx` — On mobile the "Job Done" button is back to its fixed height instead of growing to fill the hero. The job details now fill the hero: they are larger (title, customer, description and price, with the description in a bigger, easier to read size) and centered in the space between the clock and the button. The loading placeholder and the "All done" message match. Desktop sizes are unchanged.
- `components/dashboard/dashboard-panel.tsx` — Updated the comment on the current job wrapper.

### Bug Fixes

- None.

## [0.8.1] - 2026-09-28

### Added

- None.

### Updated

- None.

### Bug Fixes

- `components/dashboard/dashboard-panel.tsx` — Removed the big empty gap in the mobile hero. The current job was pushed to the bottom of the full-screen hero, far from the clock. On mobile it now sits right under the clock and stretches to fill the hero. On desktop it still sits at the bottom of the left column.
- `components/dashboard/current-job-section.tsx` — On mobile the "Job Done" button (and its loading placeholder) grows to fill the space left in the hero instead of leaving it empty.
- `components/dashboard/parallax-hero.tsx` — Tighter spacing on mobile: smaller gap between the clock row and the current job, and less space above "Scroll for Stats".

## [0.8.0] - 2026-09-28

### Added

- `components/dashboard/parallax-hero.tsx` — `ParallaxHero`: on mobile (below the `lg` breakpoint) the clock and current job fill the screen below the site header. As you scroll, the hero content drifts at 40% of the scroll speed, fades and shrinks slightly while the stats slide up over it. A bouncing "Scroll for Stats" indicator at the bottom of the hero smoothly scrolls to the stats when tapped and fades out once scrolling starts. The effect is off on desktop and for visitors who prefer reduced motion.
- `components/dashboard/dashboard-icons.tsx` — `ChevronDownIcon`.

### Updated

- `components/dashboard/dashboard-panel.tsx` — The left column is now wrapped in `ParallaxHero`. On mobile the clock and "Sign out" share one compact row, and the cards sit in a rounded "stats" sheet that scrolls up over the hero. The card grid is two columns on mobile: Profit, Next Job and Top spending are full width, and Money in and Money out sit side by side. The desktop layout is unchanged.
- `components/dashboard/current-job-section.tsx` — Larger job title, customer, description, price and "Job Done" button on mobile, where the current job is the hero. Desktop sizes are unchanged.
- `components/dashboard/dashboard-clock.tsx` — Smaller time and spacing on mobile.
- `components/dashboard/dashboard-card.tsx` — Cards are more compact on mobile: less padding, no minimum height and smaller big amounts. The card header wraps, so the trend badge drops below the title on narrow tiles. The loading skeleton scales down to fit.
- `components/dashboard/money-in-card.tsx` — Thinner and shorter daily bars on mobile, so the whole month fits in a half width tile.
- `components/dashboard/profit-card.tsx` — Shorter tick slider on mobile.
- `components/dashboard/next-job-card.tsx` and `components/dashboard/top-spending-card.tsx` — Accept a `className` so the panel can set their width. Top spending's percentage is smaller on mobile.

### Bug Fixes

- None.

## [0.7.1] - 2026-09-28

### Added

- None.

### Updated

- None.

### Bug Fixes

- `components/dashboard/dashboard-panel.tsx` — The "Job Done" button now lines up with the bottom of the dashboard cards on large screens. The current job section was vertically centered in the left column, which left empty space below the button. It now sits at the bottom of the column, and the column's bottom padding was removed.

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
