import type { Skill, SkillDetail, TriggerTestResult, SyncResult } from "./types";

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => res.statusText);
    throw new Error(detail);
  }
  return res.json() as Promise<T>;
}

export async function fetchSkills(q?: string, tags?: string[]): Promise<Skill[]> {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (tags && tags.length > 0) {
    tags.forEach((t) => params.append("tags", t));
  }
  const qs = params.toString();
  return request<Skill[]>(`/api/skills${qs ? `?${qs}` : ""}`);
}

export async function fetchSkill(name: string): Promise<SkillDetail> {
  return request<SkillDetail>(`/api/skills/${encodeURIComponent(name)}`);
}

export async function testTrigger(name: string, prompt: string): Promise<TriggerTestResult> {
  return request<TriggerTestResult>(`/api/skills/${encodeURIComponent(name)}/test`, {
    method: "POST",
    body: JSON.stringify({ prompt }),
  });
}

export async function syncSkills(): Promise<SyncResult> {
  return request<SyncResult>("/api/sync", { method: "POST" });
}

export async function openSkill(name: string, target: "editor" | "folder"): Promise<void> {
  await request(`/api/skills/${encodeURIComponent(name)}/open`, {
    method: "POST",
    body: JSON.stringify({ target }),
  });
}
