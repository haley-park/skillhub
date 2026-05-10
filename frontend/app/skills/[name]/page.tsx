"use client";
import dynamic from "next/dynamic";

const SkillDetailClient = dynamic(() => import("@/components/SkillDetailClient"), {
  ssr: false,
});

export default function Page() {
  return <SkillDetailClient />;
}
