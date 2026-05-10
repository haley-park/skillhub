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
          <p className="text-h2 text-text-primary mb-1">일치하는 스킬이 없어요</p>
          <p className="text-body text-text-secondary">
            &ldquo;{searchQuery}&rdquo;에 해당하는 스킬을 찾지 못했어요
          </p>
        </div>
        <Button variant="secondary" onClick={onClearSearch}>
          검색어 초기화
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <span className="text-6xl" aria-hidden>🪄</span>
      <div className="text-center">
        <p className="text-h2 text-text-primary mb-1">아직 스킬이 없어요</p>
        <p className="text-body text-text-secondary">
          <code className="text-mono bg-surface-hover px-1.5 py-0.5 rounded">~/skillhub/skills/</code>
          에 SKILL.md를 추가하면 자동으로 나타나요
        </p>
      </div>
    </div>
  );
}
