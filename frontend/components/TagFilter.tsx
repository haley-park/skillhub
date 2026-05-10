"use client";

import { Chip } from "@/components/ui/Chip";

interface TagFilterProps {
  tags: string[];
  selected: string[];
  onToggle: (tag: string) => void;
}

export function TagFilter({ tags, selected, onToggle }: TagFilterProps) {
  if (tags.length === 0) return null;

  const allActive = selected.length === 0;

  return (
    <nav
      aria-label="태그 필터"
      className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide"
      style={{ scrollbarWidth: "none" }}
    >
      <Chip
        label="전체"
        active={allActive}
        onClick={() => {
          if (!allActive) {
            selected.forEach((t) => onToggle(t));
          }
        }}
      />
      {tags.map((tag) => (
        <Chip
          key={tag}
          label={tag}
          active={selected.includes(tag)}
          onClick={() => onToggle(tag)}
        />
      ))}
    </nav>
  );
}
