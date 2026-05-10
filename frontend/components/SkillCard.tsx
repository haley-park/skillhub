"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Chip } from "@/components/ui/Chip";
import { relativeTime } from "@/lib/format";
import type { Skill } from "@/lib/types";

function SkillIcon({ icon, name }: { icon: string | null; name: string }) {
  if (icon) {
    return (
      <span
        className="w-12 h-12 flex items-center justify-center text-2xl bg-accent-bg rounded-lg flex-shrink-0"
        aria-hidden
      >
        {icon}
      </span>
    );
  }
  return (
    <span
      className="w-12 h-12 flex items-center justify-center bg-accent-bg rounded-lg flex-shrink-0 text-h1 text-accent font-bold uppercase"
      aria-hidden
    >
      {name.charAt(0)}
    </span>
  );
}

interface SkillCardProps {
  skill: Skill;
}

export function SkillCard({ skill }: SkillCardProps) {
  const visibleTags = skill.tags.slice(0, 3);
  const hiddenCount = skill.tags.length - 3;

  return (
    <motion.article
      whileHover={{ y: -2, borderColor: "#D1D6DB" }}
      transition={{ duration: 0.2 }}
      className="bg-surface border border-border rounded-lg p-6 flex flex-col gap-4 cursor-pointer relative"
      style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.04)" }}
    >
      <Link
        href={`/skills/${encodeURIComponent(skill.name)}`}
        className="absolute inset-0 rounded-lg"
        aria-label={skill.name}
      />

      <div className="flex items-start justify-between gap-3">
        <SkillIcon icon={skill.icon} name={skill.name} />
      </div>

      <div className="flex flex-col gap-1 flex-1">
        <h2 className="text-h1 text-text-primary truncate">{skill.name}</h2>
        <p className="text-body text-text-secondary line-clamp-2">{skill.description}</p>
      </div>

      <div className="flex items-center justify-between gap-2 mt-auto">
        <div className="flex items-center gap-1.5 flex-wrap">
          {visibleTags.map((tag) => (
            <Chip key={tag} label={tag} />
          ))}
          {hiddenCount > 0 && (
            <Chip label={`+${hiddenCount}`} />
          )}
        </div>
        <time
          dateTime={skill.last_modified}
          className="text-caption text-text-tertiary whitespace-nowrap flex-shrink-0"
        >
          {relativeTime(skill.last_modified)}
        </time>
      </div>
    </motion.article>
  );
}
