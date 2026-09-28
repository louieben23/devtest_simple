"use client";

import { useSyncExternalStore } from "react";

const MILLISECONDS_PER_MINUTE = 60_000;

function subscribeToClock(onClockTick: () => void) {
  const intervalId = setInterval(onClockTick, 10_000);
  return () => clearInterval(intervalId);
}

// Snapshot is the current minute, so the clock only re-renders when the minute changes.
function getCurrentMinute() {
  return Math.floor(Date.now() / MILLISECONDS_PER_MINUTE);
}

// The server doesn't know the visitor's time zone, so the time only shows in the browser.
function getServerMinute() {
  return null;
}

function getGreeting(hour: number) {
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export function DashboardClock({ firstName }: { firstName: string }) {
  const currentMinute = useSyncExternalStore(subscribeToClock, getCurrentMinute, getServerMinute);
  const now = currentMinute === null ? null : new Date(currentMinute * MILLISECONDS_PER_MINUTE);

  const hours = now?.getHours() ?? 0;
  const displayHours = hours % 12 || 12;
  const displayMinutes = String(now?.getMinutes() ?? 0).padStart(2, "0");

  return (
    <div>
      <p className="h-10 text-4xl font-light tracking-tight tabular-nums text-zinc-900 dark:text-zinc-50">
        {now && (
          <>
            {displayHours}:{displayMinutes}
            <span className="text-2xl">{hours < 12 ? "am" : "pm"}</span>
          </>
        )}
      </p>
      <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
        {now ? getGreeting(hours) : "Welcome back"},
        <br />
        <span className="font-bold text-zinc-900 dark:text-zinc-50">{firstName}</span>
      </p>
    </div>
  );
}
