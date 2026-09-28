"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { GITHUB_REPOSITORY_URL, GitHubIcon } from "@/components/github-icon";

// The `lg` breakpoint, where the header shows its links and the sidebar isn't needed.
const DESKTOP_MEDIA_QUERY = "(min-width: 1024px)";
const SIDEBAR_ID = "mobile-sidebar";

// On mobile the header links live in a sidebar that slides in from the left.
export function MobileSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const desktopQuery = window.matchMedia(DESKTOP_MEDIA_QUERY);
    const menuButton = menuButtonRef.current;

    function closeSidebar() {
      setIsOpen(false);
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") closeSidebar();
    }

    // The page behind the sidebar doesn't scroll while it's open.
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();
    window.addEventListener("keydown", handleKeyDown);
    desktopQuery.addEventListener("change", closeSidebar);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
      desktopQuery.removeEventListener("change", closeSidebar);
      menuButton?.focus();
    };
  }, [isOpen]);

  return (
    <div className="lg:hidden">
      <button
        ref={menuButtonRef}
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Open menu"
        aria-expanded={isOpen}
        aria-controls={SIDEBAR_ID}
        className="flex h-9 w-9 items-center justify-center rounded-full text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
      >
        <MenuIcon />
      </button>

      {/* Tapping outside the sidebar closes it. */}
      <div
        aria-hidden="true"
        onClick={() => setIsOpen(false)}
        className={`fixed inset-0 z-50 bg-black/30 transition-opacity duration-300 motion-reduce:transition-none ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        id={SIDEBAR_ID}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        // `invisible` keeps the closed sidebar out of the tab order and away from screen readers.
        className={`fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col bg-zinc-50 px-4 py-5 shadow-[12px_0_32px_-12px_rgba(0,0,0,0.2)] transition-[translate,visibility] duration-300 motion-reduce:transition-none dark:bg-black ${
          isOpen ? "visible translate-x-0" : "invisible -translate-x-full"
        }`}
      >
        <div className="flex h-9 items-center justify-between">
          <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Menu
          </p>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={() => setIsOpen(false)}
            aria-label="Close menu"
            className="flex h-9 w-9 items-center justify-center rounded-full text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
          >
            <CloseIcon />
          </button>
        </div>

        <nav className="mt-6 flex flex-col gap-3">
          <Link
            href="/about"
            onClick={() => setIsOpen(false)}
            className="flex h-11 items-center rounded-full px-4 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-50"
          >
            About
          </Link>
          <a
            href={GITHUB_REPOSITORY_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setIsOpen(false)}
            className="flex h-11 items-center justify-center gap-2 rounded-full bg-black px-4 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-black dark:hover:bg-zinc-200"
          >
            <GitHubIcon />
            See on GitHub
          </a>
        </nav>
      </aside>
    </div>
  );
}

function MenuIcon() {
  return (
    <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}
