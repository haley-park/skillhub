"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Input";
import { testTrigger } from "@/lib/api";
import { formatCost } from "@/lib/format";
import type { TriggerTestResult } from "@/lib/types";

interface TriggerTestModalProps {
  open: boolean;
  onClose: () => void;
  skillName: string;
}

export function TriggerTestModal({ open, onClose, skillName }: TriggerTestModalProps) {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TriggerTestResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleTest() {
    if (!prompt.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await testTrigger(skillName, prompt);
      setResult(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : "오류가 발생했어요");
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setPrompt("");
    setResult(null);
    setError(null);
  }

  function handleClose() {
    handleReset();
    onClose();
  }

  return (
    <Modal open={open} onClose={handleClose} title="트리거 테스트">
      <div className="flex flex-col gap-4">
        <p className="text-caption text-text-secondary">
          이 스킬이 어떤 사용자 메시지에서 호출될지 확인해보세요
        </p>

        <Textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="예: PDF에서 표를 뽑아줘"
          rows={4}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleTest();
          }}
          aria-label="테스트 메시지 입력"
        />

        <Button
          variant="primary"
          onClick={handleTest}
          loading={loading}
          disabled={!prompt.trim()}
          className="w-full"
        >
          테스트 실행
        </Button>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="p-4 rounded-md bg-[#FFF0F1] border border-danger/20 text-danger text-caption"
              role="alert"
            >
              {error}
            </motion.div>
          )}

          {result && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col gap-4"
            >
              {/* Result badge */}
              <div
                className="flex items-center gap-3 p-4 rounded-md border"
                style={{
                  backgroundColor: result.triggered ? "#F0FDF8" : "#FFFBF0",
                  borderColor: result.triggered ? "var(--color-success)" : "var(--color-warning)",
                }}
              >
                <span className="text-2xl" aria-hidden>
                  {result.triggered ? "✅" : "⚠️"}
                </span>
                <div>
                  <p
                    className="font-semibold text-body"
                    style={{ color: result.triggered ? "var(--color-success)" : "var(--color-warning)" }}
                  >
                    {result.triggered ? "트리거됨" : "트리거 안 됨"}
                  </p>
                  <p className="text-caption text-text-secondary">{result.reason}</p>
                </div>
              </div>

              {/* Meta */}
              <div className="flex items-center gap-4 text-caption text-text-tertiary font-mono">
                <span>{result.tokens_used}토큰</span>
                <span>·</span>
                <span>{formatCost(result.cost_usd)}</span>
                <span>·</span>
                <span>{result.latency_ms}ms</span>
              </div>

              {/* Reset button */}
              <Button variant="secondary" onClick={handleReset} className="w-full">
                다시 테스트
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Modal>
  );
}
