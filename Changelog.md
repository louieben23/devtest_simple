# Changelog

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
