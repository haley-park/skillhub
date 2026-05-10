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

  if (minutes < 1) return "방금 전";
  if (minutes < 60) return `${minutes}분 전`;
  if (hours < 24) return `${hours}시간 전`;
  if (days === 1) return "어제";
  if (days < 7) return `${days}일 전`;
  if (weeks === 1) return "지난주";
  if (weeks < 4) return `${weeks}주 전`;

  return dt.toFormat("yyyy.MM.dd");
}

export function formatCost(usd: number): string {
  if (usd < 0.001) return `$${(usd * 1000).toFixed(4)}m`;
  return `$${usd.toFixed(4)}`;
}
