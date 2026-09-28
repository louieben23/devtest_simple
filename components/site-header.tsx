import Link from "next/link";
import { GITHUB_REPOSITORY_URL, GitHubIcon } from "@/components/github-icon";
import { MobileSidebar } from "@/components/mobile-sidebar";

// On mobile: menu button on the left and the logo centered; the links move into the sidebar.
// On desktop: logo on the left and the links on the right.
export function SiteHeader() {
  return (
    <header className="grid w-full max-w-5xl grid-cols-[1fr_auto_1fr] items-center py-5 lg:flex lg:justify-between">
      <MobileSidebar />

      <Link
        href="/"
        aria-label="Angus Shield home"
        className="text-lg uppercase tracking-[0.2em] text-zinc-600 dark:text-zinc-400"
      >
        <span className="font-bold text-black dark:text-zinc-50">A</span>ngus{" "}
        <span className="font-bold text-[#C8372D]">S</span>hield
      </Link>

      <nav className="hidden items-center gap-2 lg:flex">
        <Link
          href="/about"
          className="flex h-9 items-center px-4 text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
        >
          About
        </Link>
        <a
          href={GITHUB_REPOSITORY_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-9 items-center gap-2 rounded-full bg-black px-4 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-black dark:hover:bg-zinc-200"
        >
          <GitHubIcon />
          See on GitHub
        </a>
      </nav>
    </header>
  );
}
