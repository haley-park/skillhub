export interface Skill {
  id: string;
  name: string;
  description: string;
  tags: string[];
  version: string | null;
  icon: string | null;
  last_modified: string;
  indexed_at: string;
}

export interface SkillDetail extends Skill {
  body: string;
  path: string;
}

export interface TriggerTestResult {
  triggered: boolean;
  reason: string;
  tokens_used: number;
  input_tokens: number;
  output_tokens: number;
  latency_ms: number;
  cost_usd: number;
}

export interface SyncResult {
  added: number;
  updated: number;
  removed: number;
}
