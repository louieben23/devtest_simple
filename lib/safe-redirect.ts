// Only allow same-origin relative paths, to prevent open redirects
// via ?next=https://evil.example or ?next=//evil.example.
export function safeNextPath(next: unknown, fallback = "/"): string {
  if (typeof next !== "string") return fallback;
  if (!next.startsWith("/") || next.startsWith("//") || next.startsWith("/\\")) {
    return fallback;
  }
  return next;
}
