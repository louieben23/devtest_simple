// Shared by the dashboard and its loading skeleton, so the skeleton lines up with the real layout.

// Clock and current job on the left; the cards on the right.
export const DASHBOARD_GRID_CLASS_NAME = "grid grid-cols-1 gap-6 lg:grid-cols-[16rem_minmax(0,1fr)]";

// On mobile the cards are a sheet that slides up over the hero, with Money in and Money out side by side.
export const STATS_GRID_CLASS_NAME =
  "grid scroll-mt-4 grid-cols-2 gap-3 md:grid-cols-3 max-lg:relative max-lg:z-10 max-lg:-mx-4 max-lg:rounded-t-3xl max-lg:bg-zinc-50 max-lg:px-4 max-lg:pt-4 max-lg:shadow-[0_-12px_32px_-12px_rgba(0,0,0,0.12)] max-lg:dark:bg-black";
