import { Button } from "@/components/ui/Button";

interface EmptyStateProps {
  type: "empty" | "no-results";
  searchQuery?: string;
  onClearSearch?: () => void;
}

export function EmptyState({ type, searchQuery, onClearSearch }: EmptyStateProps) {
  if (type === "no-results") {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <span className="text-6xl" aria-hidden>🔍</span>
        <div className="text-center">
          <p className="text-h2 text-text-primary mb-1">No matching skills</p>
          <p className="text-body text-text-secondary">
            No skills found for &ldquo;{searchQuery}&rdquo;
          </p>
        </div>
        <Button variant="secondary" onClick={onClearSearch}>
          Clear search
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <span className="text-6xl" aria-hidden>🪄</span>
      <div className="text-center">
        <p className="text-h2 text-text-primary mb-1">No skills yet</p>
        <p className="text-body text-text-secondary">
          Add a SKILL.md to{" "}
          <code className="text-mono bg-surface-hover px-1.5 py-0.5 rounded">~/skillhub/skills/</code>
          {" "}and it'll appear automatically
        </p>
      </div>
    </div>
  );
}
