"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { syncSkills } from "@/lib/api";

interface HeaderProps {
  onSync?: () => void;
}

export function Header({ onSync }: HeaderProps) {
  const { toast } = useToast();

  async function handleSync() {
    try {
      const result = await syncSkills();
      toast(`Synced: +${result.added} ~${result.updated} -${result.removed}`, "success");
      onSync?.();
    } catch {
      toast("Sync failed", "error");
    }
  }

  return (
    <header className="sticky top-0 z-40 bg-surface border-b border-border">
      <div className="max-w-container mx-auto px-6 md:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-2xl" aria-hidden>🧠</span>
          <span className="font-bold text-h2 text-text-primary group-hover:text-accent transition-colors duration-150">
            Skillhub
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSync}
            aria-label="Sync skills"
            title="Sync"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 2v4h-4M2 16v-4h4" />
              <path d="M3.51 9a7 7 0 0 1 13.12-2.88M14.49 9a7 7 0 0 1-13.12 2.88" />
            </svg>
          </Button>
        </div>
      </div>
    </header>
  );
}
