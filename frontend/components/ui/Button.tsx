"use client";

import { forwardRef } from "react";
import { motion } from "framer-motion";
import { clsx } from "clsx";

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "sm" | "icon";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

const variantStyles: Record<Variant, string> = {
  primary:
    "bg-accent text-white hover:bg-accent-hover active:bg-accent-hover font-semibold",
  secondary:
    "bg-surface border border-border text-text-primary hover:bg-surface-hover",
  ghost: "bg-transparent text-text-secondary hover:bg-surface-hover",
};

const sizeStyles: Record<Size, string> = {
  md: "h-12 px-5 text-body rounded-md",
  sm: "h-8 px-3 text-caption rounded-sm",
  icon: "h-10 w-10 rounded-md flex items-center justify-center",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "secondary", size = "md", loading, className, children, disabled, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.15 }}
        className={clsx(
          "inline-flex items-center justify-center gap-2 cursor-pointer select-none transition-colors duration-150",
          "disabled:opacity-40 disabled:cursor-not-allowed",
          variantStyles[variant],
          sizeStyles[size],
          className,
        )}
        disabled={disabled || loading}
        {...(props as React.ComponentPropsWithoutRef<typeof motion.button>)}
      >
        {loading ? (
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : children}
      </motion.button>
    );
  },
);

Button.displayName = "Button";
