import { clsx } from "clsx";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={clsx(
        "animate-pulse bg-surface-hover rounded-md",
        className,
      )}
      aria-hidden="true"
    />
  );
}

export function SkillCardSkeleton() {
  return (
    <div className="bg-surface border border-border rounded-lg p-6 flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <Skeleton className="w-12 h-12 rounded-lg" />
        <Skeleton className="w-6 h-6 rounded" />
      </div>
      <div className="flex flex-col gap-2">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
      <div className="flex items-center justify-between mt-auto">
        <div className="flex gap-2">
          <Skeleton className="h-8 w-16 rounded-sm" />
          <Skeleton className="h-8 w-20 rounded-sm" />
        </div>
        <Skeleton className="h-4 w-14" />
      </div>
    </div>
  );
}
