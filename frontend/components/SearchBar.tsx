"use client";

import { useEffect, useRef } from "react";
import { Input } from "@/components/ui/Input";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  return (
    <Input
      ref={inputRef}
      type="search"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Search by name, description or tag (/)"
      aria-label="Search skills"
      icon={
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="7" cy="7" r="5" />
          <path d="M11 11l3 3" />
        </svg>
      }
    />
  );
}
