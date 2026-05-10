"use client";
import dynamic from "next/dynamic";

// SSR 비활성화 — 브라우저 확장 프로그램의 DOM 수정으로 인한 hydration mismatch 방지
const HomePageClient = dynamic(() => import("@/components/HomePageClient"), {
  ssr: false,
});

export default function Page() {
  return <HomePageClient />;
}
