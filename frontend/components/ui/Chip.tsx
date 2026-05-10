"use client";

import { clsx } from "clsx";

interface ChipProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}

export function Chip({ label, active, onClick, className }: ChipProps) {
  const isInteractive = !!onClick;

  return (
    <span
      role={isInteractive ? "button" : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      onClick={onClick}
      onKeyDown={
        isInteractive
          ? (e) => (e.key === "Enter" || e.key === " ") && onClick?.()
          : undefined
      }
      className={clsx(
        "inline-flex items-center h-8 px-3 rounded-sm text-caption whitespace-nowrap transition-colors duration-150",
        active
          ? "bg-accent-bg text-accent font-semibold"
          : "bg-surface-hover text-text-secondary",
        isInteractive && "cursor-pointer hover:opacity-80",
        className,
      )}
    >
      {label}
    </span>
  );
}
