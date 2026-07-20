/**
 * Formats a date/ISO-string into a short relative time string:
 * "just now", "5 min ago", "2 hr ago", "3 day ago", "1 week ago", etc.
 * Falls back to a plain date (e.g. "Jan 4, 2026") once it's more than
 * ~4 weeks old, since "6 week ago" stops being a useful signal.
 */
export function formatTimeAgo(dateInput) {
  if (!dateInput) return "";

  const date = new Date(dateInput);
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

  if (seconds < 0) return "just now"; // clock skew guard
  if (seconds < 60) return "just now";

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day ago`;

  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `${weeks} week ago`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
