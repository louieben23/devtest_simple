# Changelog

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
