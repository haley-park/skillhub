import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "var(--color-bg)",
        surface: "var(--color-surface)",
        "surface-hover": "var(--color-surface-hover)",
        border: "var(--color-border)",
        "text-primary": "var(--color-text-primary)",
        "text-secondary": "var(--color-text-secondary)",
        "text-tertiary": "var(--color-text-tertiary)",
        "text-disabled": "var(--color-text-disabled)",
        accent: "var(--color-accent)",
        "accent-hover": "var(--color-accent-hover)",
        "accent-bg": "var(--color-accent-bg)",
        success: "var(--color-success)",
        warning: "var(--color-warning)",
        danger: "var(--color-danger)",
      },
      borderRadius: {
        sm: "var(--r-sm)",
        md: "var(--r-md)",
        lg: "var(--r-lg)",
        xl: "var(--r-xl)",
      },
      fontFamily: {
        sans: ["Pretendard Variable", "Pretendard", "Noto Sans KR", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
      fontSize: {
        display: ["32px", { lineHeight: "1.3", letterSpacing: "-0.02em", fontWeight: "700" }],
        h1: ["24px", { lineHeight: "1.4", letterSpacing: "-0.01em", fontWeight: "700" }],
        h2: ["18px", { lineHeight: "1.5", letterSpacing: "-0.01em", fontWeight: "600" }],
        body: ["15px", { lineHeight: "1.6", letterSpacing: "-0.01em" }],
        caption: ["13px", { lineHeight: "1.5", letterSpacing: "-0.01em", fontWeight: "500" }],
        mono: ["14px", { lineHeight: "1.6" }],
      },
      boxShadow: {
        card: "0 1px 2px rgba(0,0,0,0.04)",
        "card-hover": "0 4px 12px rgba(0,0,0,0.06)",
        focus: "0 0 0 4px var(--color-accent-bg)",
      },
      maxWidth: {
        container: "1200px",
      },
      animation: {
        "fade-in": "fadeIn 0.2s ease-out",
        "slide-up": "slideUp 0.3s cubic-bezier(0.16,1,0.3,1)",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
