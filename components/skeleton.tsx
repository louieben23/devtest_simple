// A pulsing grey block that stands in for content while it loads.
// Set its size and shape with `className`, e.g. "h-4 w-24 rounded-md".
export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse bg-zinc-200/70 motion-reduce:animate-none dark:bg-zinc-800 ${className}`}
    />
  );
}
