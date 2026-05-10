import { DateTime } from "luxon";

export function relativeTime(isoString: string): string {
  const dt = DateTime.fromISO(isoString);
  if (!dt.isValid) return "";

  const now = DateTime.now();
  const diff = now.diff(dt, ["minutes", "hours", "days", "weeks"]);

  const minutes = Math.floor(diff.minutes);
  const hours = Math.floor(diff.hours);
  const days = Math.floor(diff.days);
  const weeks = Math.floor(diff.weeks);

  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return "yesterday";
  if (days < 7) return `${days}d ago`;
  if (weeks === 1) return "last week";
  if (weeks < 4) return `${weeks}w ago`;

  return dt.toFormat("yyyy-MM-dd");
}

export function formatCost(usd: number): string {
  if (usd < 0.001) return `$${(usd * 1000).toFixed(4)}m`;
  return `$${usd.toFixed(4)}`;
}
