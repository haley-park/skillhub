"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { Skeleton } from "@/components/ui/Skeleton";
import { TriggerTestModal } from "@/components/TriggerTestModal";
import { useToast } from "@/components/ui/Toast";
import { fetchSkill, openSkill } from "@/lib/api";
import { relativeTime } from "@/lib/format";
import type { SkillDetail } from "@/lib/types";

function SkillIcon({ icon, name }: { icon: string | null; name: string }) {
  if (icon) {
    return (
      <span className="w-16 h-16 flex items-center justify-center text-3xl bg-accent-bg rounded-lg flex-shrink-0" aria-hidden>
        {icon}
      </span>
    );
  }
  return (
    <span className="w-16 h-16 flex items-center justify-center bg-accent-bg rounded-lg flex-shrink-0 text-display text-accent font-bold uppercase" aria-hidden>
      {name.charAt(0)}
    </span>
  );
}

export default function SkillDetailPage() {
  const params = useParams<{ name: string }>();
  const skillName = decodeURIComponent(params.name);
  const { toast } = useToast();

  const [skill, setSkill] = useState<SkillDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [testOpen, setTestOpen] = useState(false);

  useEffect(() => {
    fetchSkill(skillName)
      .then(setSkill)
      .catch((err) => {
        if (err.message?.includes("404") || err.message?.includes("not found")) {
          setNotFound(true);
        }
      })
      .finally(() => setLoading(false));
  }, [skillName]);

  async function handleOpen(target: "editor" | "folder") {
    try {
      await openSkill(skillName, target);
      toast(target === "editor" ? "Opened in editor" : "Opened folder", "success");
    } catch {
      toast("Failed to open", "error");
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-bg">
        <Header />
        <main className="max-w-container mx-auto px-6 md:px-8 py-12">
          <Skeleton className="h-5 w-48 mb-8" />
          <div className="bg-surface border border-border rounded-lg p-8 mb-8">
            <div className="flex items-start gap-6 mb-6">
              <Skeleton className="w-16 h-16 rounded-lg" />
              <div className="flex-1 flex flex-col gap-3">
                <Skeleton className="h-9 w-64" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-3/4" />
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-5/6" />
            <Skeleton className="h-5 w-4/5" />
          </div>
        </main>
      </div>
    );
  }

  if (notFound || !skill) {
    return (
      <div className="min-h-screen bg-bg">
        <Header />
        <main className="max-w-container mx-auto px-6 md:px-8 py-24 text-center">
          <p className="text-6xl mb-4" aria-hidden>🤔</p>
          <h1 className="text-h1 text-text-primary mb-2">Skill not found</h1>
          <p className="text-body text-text-secondary mb-6">
            &ldquo;{skillName}&rdquo; doesn&apos;t exist or has been deleted
          </p>
          <Link href="/">
            <Button variant="primary">Back to Library</Button>
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg">
      <Header />

      <main className="max-w-container mx-auto px-6 md:px-8 py-12">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-caption text-text-tertiary mb-8">
          <Link href="/" className="hover:text-accent transition-colors duration-150 flex items-center gap-1">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 11L5 7l4-4" />
            </svg>
            Skillhub
          </Link>
          <span aria-hidden>/</span>
          <span className="text-text-secondary font-medium">{skill.name}</span>
        </nav>

        {/* Header card */}
        <div className="bg-surface border border-border rounded-lg p-8 mb-8" style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.04)" }}>
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="flex items-start gap-5 flex-1 min-w-0">
              <SkillIcon icon={skill.icon} name={skill.name} />
              <div className="flex-1 min-w-0">
                <h1 className="text-display text-text-primary mb-2 break-words">{skill.name}</h1>
                <p className="text-body text-text-secondary mb-4">{skill.description}</p>

                {/* Meta row */}
                <div className="flex flex-wrap items-center gap-2">
                  {skill.tags.map((tag) => (
                    <Chip key={tag} label={tag} />
                  ))}
                  {skill.version && (
                    <span className="inline-flex items-center h-8 px-3 rounded-sm text-caption bg-accent-bg text-accent font-semibold">
                      v{skill.version}
                    </span>
                  )}
                  <time dateTime={skill.last_modified} className="text-caption text-text-tertiary">
                    modified {relativeTime(skill.last_modified)}
                  </time>
                </div>
              </div>
            </div>

            {/* Action bar */}
            <div className="flex flex-row md:flex-col gap-2 flex-shrink-0">
              <Button variant="primary" onClick={() => setTestOpen(true)}>
                🧪 Test Trigger
              </Button>
              <Button variant="secondary" onClick={() => handleOpen("folder")}>
                📁 Open Folder
              </Button>
              <Button variant="secondary" onClick={() => handleOpen("editor")}>
                ✏️ Open in Editor
              </Button>
            </div>
          </div>
        </div>

        {/* Markdown body */}
        {skill.body && (
          <article className="bg-surface border border-border rounded-lg p-8 prose max-w-none" style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.04)" }}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {skill.body}
            </ReactMarkdown>
          </article>
        )}
      </main>

      <TriggerTestModal
        open={testOpen}
        onClose={() => setTestOpen(false)}
        skillName={skill.name}
      />
    </div>
  );
}
