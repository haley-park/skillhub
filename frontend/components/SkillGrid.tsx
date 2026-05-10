"use client";

import { motion } from "framer-motion";
import { SkillCard } from "@/components/SkillCard";
import { SkillCardSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/EmptyState";
import type { Skill } from "@/lib/types";

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.04 },
  },
};

const item = {
  hidden: { opacity: 0, y: 8 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
  },
};

interface SkillGridProps {
  skills: Skill[];
  loading: boolean;
  searchQuery: string;
  onClearSearch: () => void;
}

export function SkillGrid({ skills, loading, searchQuery, onClearSearch }: SkillGridProps) {
  if (loading) {
    return (
      <div
        className="grid gap-4"
        style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}
        aria-label="스킬 로딩 중"
        aria-busy="true"
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <SkillCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (skills.length === 0 && searchQuery) {
    return <EmptyState type="no-results" searchQuery={searchQuery} onClearSearch={onClearSearch} />;
  }

  if (skills.length === 0) {
    return <EmptyState type="empty" />;
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid gap-4"
      style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}
      aria-label={`스킬 ${skills.length}개`}
    >
      {skills.map((skill) => (
        <motion.div key={skill.id} variants={item}>
          <SkillCard skill={skill} />
        </motion.div>
      ))}
    </motion.div>
  );
}
