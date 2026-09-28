import { GITHUB_REPOSITORY_URL, GitHubIcon } from "@/components/github-icon";

export function SiteFooter() {
  return (
    <footer className="flex items-center gap-2 py-6 text-xs text-zinc-500 dark:text-zinc-400">
      SIMPLE by Louie Casapao
      <a
        href={GITHUB_REPOSITORY_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="GitHub repository"
        className="transition-colors hover:text-zinc-900 dark:hover:text-zinc-50"
      >
        <GitHubIcon />
      </a>
    </footer>
  );
}
