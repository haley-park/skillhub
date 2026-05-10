"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Header } from "@/components/Header";
import { SearchBar } from "@/components/SearchBar";
import { TagFilter } from "@/components/TagFilter";
import { SkillGrid } from "@/components/SkillGrid";
import { fetchSkills } from "@/lib/api";
import { relativeTime } from "@/lib/format";
import type { Skill } from "@/lib/types";

const POLL_INTERVAL = 5000;
const DEBOUNCE_MS = 200;

export default function HomePageClient() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [lastSync, setLastSync] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadSkills = useCallback(async () => {
    try {
      const data = await fetchSkills();
      setSkills(data);
      setLastSync(new Date().toISOString());
    } catch (err) {
      console.error("Failed to load skills:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadSkills(); }, [loadSkills]);

  useEffect(() => {
    const id = setInterval(loadSkills, POLL_INTERVAL);
    return () => clearInterval(id);
  }, [loadSkills]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setDebouncedQuery(searchQuery), DEBOUNCE_MS);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [searchQuery]);

  const filteredSkills = useMemo(() => {
    let result = skills;
    if (debouncedQuery) {
      const q = debouncedQuery.toLowerCase();
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          s.tags.some((t) => t.toLowerCase().includes(q)),
      );
    }
    if (selectedTags.length > 0) {
      result = result.filter((s) => selectedTags.every((tag) => s.tags.includes(tag)));
    }
    return result;
  }, [skills, debouncedQuery, selectedTags]);

  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    skills.forEach((s) => s.tags.forEach((t) => tagSet.add(t)));
    return Array.from(tagSet).sort();
  }, [skills]);

  function toggleTag(tag: string) {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  }

  return (
    <div className="min-h-screen bg-bg">
      <Header onSync={loadSkills} />

      <main className="max-w-container mx-auto px-6 md:px-8 py-12">
        <section className="mb-12" aria-label="Summary">
          <h1 className="text-display text-text-primary mb-2">
            My Skills{" "}
            <span className="text-accent">{loading ? "—" : skills.length}</span>
          </h1>
          {lastSync && (
            <p className="text-caption text-text-tertiary">
              Last synced{" "}
              <time dateTime={lastSync}>{relativeTime(lastSync)}</time>
            </p>
          )}
        </section>

        <section className="mb-4" aria-label="Search">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </section>

        {allTags.length > 0 && (
          <section className="mb-8" aria-label="Tag filter">
            <TagFilter tags={allTags} selected={selectedTags} onToggle={toggleTag} />
          </section>
        )}

        <section aria-label="Skill list">
          <SkillGrid
            skills={filteredSkills}
            loading={loading}
            searchQuery={debouncedQuery}
            onClearSearch={() => { setSearchQuery(""); setDebouncedQuery(""); }}
          />
        </section>
      </main>
    </div>
  );
}
