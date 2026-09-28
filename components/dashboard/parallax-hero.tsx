"use client";

import { useEffect, useRef, type MouseEvent, type ReactNode } from "react";
import { ChevronDownIcon } from "@/components/dashboard/dashboard-icons";

// Below the `lg` breakpoint, where the dashboard is a single column.
const MOBILE_MEDIA_QUERY = "(max-width: 1023.98px)";
const REDUCED_MOTION_MEDIA_QUERY = "(prefers-reduced-motion: reduce)";
// The hero content moves at 40% of the scroll speed, so the stats slide up over it.
const PARALLAX_SPEED = 0.4;
const MAXIMUM_SCALE_REDUCTION = 0.05;
const MAXIMUM_FADE = 0.7;
// The indicator fades out within the first quarter of the hero being scrolled.
const INDICATOR_FADE_SPEED = 4;
// The stats section's `scroll-mt-4` leaves 16px above it once opened; the extra covers rounding.
const STATS_OPEN_TOP_PIXELS = 20;
// How far the finger has to move up before the swipe counts as opening the stats.
const SWIPE_THRESHOLD_PIXELS = 6;
// Roughly how long the smooth scroll to the stats takes. Gestures during it are ignored so they don't interrupt it.
const OPENING_STATS_DURATION_MS = 700;

function scrollToSection(sectionId: string) {
  const prefersReducedMotion = window.matchMedia(REDUCED_MOTION_MEDIA_QUERY).matches;
  document
    .getElementById(sectionId)
    ?.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth" });
}

type ParallaxHeroProps = {
  statsSectionId: string;
  // Without stats (for example when they fail to load) the hero isn't full screen and has no indicator.
  hasStats: boolean;
  children: ReactNode;
};

// On mobile, the hero fills the screen and drifts away with a parallax effect as the stats scroll over it.
// One swipe or scroll down while the hero is showing opens the stats.
export function ParallaxHero({ statsSectionId, hasStats, children }: ParallaxHeroProps) {
  const heroRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const hero = heroRef.current;
    const content = contentRef.current;
    if (!hero || !content) return;

    const mobileQuery = window.matchMedia(MOBILE_MEDIA_QUERY);
    const reducedMotionQuery = window.matchMedia(REDUCED_MOTION_MEDIA_QUERY);
    let animationFrameId = 0;

    function applyParallax() {
      animationFrameId = 0;
      if (!hero || !content) return;
      const indicator = indicatorRef.current;

      if (!mobileQuery.matches || reducedMotionQuery.matches) {
        content.style.transform = "";
        content.style.opacity = "";
        if (indicator) indicator.style.opacity = "";
        return;
      }

      const heroBounds = hero.getBoundingClientRect();
      // When the hero is taller than the screen, the effect waits until its end has been scrolled into view,
      // so the drifting content never pushes the "Job Done" button out of reach.
      const heroOverflowPixels = Math.max(heroBounds.height - window.innerHeight, 0);
      const scrolledPastPixels = Math.min(
        Math.max(-heroBounds.top - heroOverflowPixels, 0),
        heroBounds.height,
      );
      const scrollProgress = heroBounds.height > 0 ? scrolledPastPixels / heroBounds.height : 0;

      content.style.transform = `translate3d(0, ${scrolledPastPixels * PARALLAX_SPEED}px, 0) scale(${1 - scrollProgress * MAXIMUM_SCALE_REDUCTION})`;
      content.style.opacity = String(1 - scrollProgress * MAXIMUM_FADE);
      if (indicator) {
        indicator.style.opacity = String(Math.max(1 - scrollProgress * INDICATOR_FADE_SPEED, 0));
      }
    }

    // Runs at most once per frame, however often the scroll event fires.
    function scheduleParallax() {
      if (animationFrameId === 0) animationFrameId = requestAnimationFrame(applyParallax);
    }

    applyParallax();
    window.addEventListener("scroll", scheduleParallax, { passive: true });
    window.addEventListener("resize", scheduleParallax);
    mobileQuery.addEventListener("change", scheduleParallax);
    reducedMotionQuery.addEventListener("change", scheduleParallax);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("scroll", scheduleParallax);
      window.removeEventListener("resize", scheduleParallax);
      mobileQuery.removeEventListener("change", scheduleParallax);
      reducedMotionQuery.removeEventListener("change", scheduleParallax);
    };
  }, []);

  useEffect(() => {
    if (!hasStats) return;

    const mobileQuery = window.matchMedia(MOBILE_MEDIA_QUERY);
    let swipeStartY: number | null = null;
    let isOpeningStats = false;
    let openingStatsTimeoutId = 0;

    // True once the end of the hero is on screen, until the stats have been scrolled up to the top of the screen.
    // On short screens the hero scrolls normally until its end (the "Job Done" button) has been seen.
    function isHeroShowing() {
      const hero = heroRef.current;
      const statsSection = document.getElementById(statsSectionId);
      return (
        mobileQuery.matches &&
        hero !== null &&
        hero.getBoundingClientRect().bottom <= window.innerHeight + 1 &&
        statsSection !== null &&
        statsSection.getBoundingClientRect().top > STATS_OPEN_TOP_PIXELS
      );
    }

    function openStats() {
      if (isOpeningStats) return;
      isOpeningStats = true;
      scrollToSection(statsSectionId);
      openingStatsTimeoutId = window.setTimeout(() => {
        isOpeningStats = false;
      }, OPENING_STATS_DURATION_MS);
    }

    // Stops the browser's own scrolling, so it doesn't fight the smooth scroll to the stats.
    function stopNativeScroll(event: TouchEvent | WheelEvent) {
      if (event.cancelable) event.preventDefault();
    }

    // Only a swipe that starts with the hero's end on screen opens the stats. A swipe that scrolls the end
    // into view keeps scrolling normally, so the button can be seen and pressed before the stats open.
    function handleTouchStart(event: TouchEvent) {
      swipeStartY = isHeroShowing() ? event.touches[0].clientY : null;
    }

    function handleTouchMove(event: TouchEvent) {
      if (isOpeningStats) {
        stopNativeScroll(event);
        return;
      }
      if (swipeStartY === null || !isHeroShowing()) return;

      // A finger moving up scrolls the page down, towards the stats.
      const swipeUpDistance = swipeStartY - event.touches[0].clientY;
      if (swipeUpDistance > SWIPE_THRESHOLD_PIXELS) {
        stopNativeScroll(event);
        openStats();
      }
    }

    function handleWheel(event: WheelEvent) {
      if (isOpeningStats) {
        stopNativeScroll(event);
        return;
      }
      if (event.deltaY > 0 && isHeroShowing()) {
        stopNativeScroll(event);
        openStats();
      }
    }

    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    // Not passive, so the browser's own scrolling can be stopped.
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      window.clearTimeout(openingStatsTimeoutId);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("wheel", handleWheel);
    };
  }, [hasStats, statsSectionId]);

  function scrollToStats(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    scrollToSection(statsSectionId);
  }

  return (
    <aside
      ref={heroRef}
      // Fills the screen below the site header on mobile.
      className={`flex flex-col pt-2 ${hasStats ? "max-lg:min-h-[calc(100svh-7.5rem)]" : ""}`}
    >
      <div ref={contentRef} className="flex flex-1 flex-col gap-4 will-change-transform lg:gap-8">
        {children}
      </div>

      {hasStats && (
        <a
          ref={indicatorRef}
          href={`#${statsSectionId}`}
          onClick={scrollToStats}
          className="mx-auto mt-2 flex flex-col items-center gap-1 py-1 text-[11px] font-bold uppercase tracking-wider text-zinc-500 transition-colors hover:text-zinc-900 lg:hidden dark:text-zinc-400 dark:hover:text-zinc-50"
        >
          Scroll for Stats
          <ChevronDownIcon className="motion-safe:animate-bounce" />
        </a>
      )}
    </aside>
  );
}
