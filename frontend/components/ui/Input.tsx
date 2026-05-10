"use client";

import { forwardRef } from "react";
import { clsx } from "clsx";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ icon, className, ...props }, ref) => {
    return (
      <div className="relative w-full">
        {icon && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none">
            {icon}
          </span>
        )}
        <input
          ref={ref}
          className={clsx(
            "w-full h-12 rounded-md border border-border bg-surface text-body text-text-primary",
            "placeholder:text-text-tertiary",
            "transition-all duration-150",
            "focus:outline-none focus:border-accent focus:shadow-focus",
            icon ? "pl-10 pr-4" : "px-4",
            className,
          )}
          {...props}
        />
      </div>
    );
  },
);

Input.displayName = "Input";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={clsx(
          "w-full rounded-md border border-border bg-surface text-body text-text-primary",
          "placeholder:text-text-tertiary",
          "p-4 resize-none transition-all duration-150",
          "focus:outline-none focus:border-accent focus:shadow-focus",
          className,
        )}
        {...props}
      />
    );
  },
);

Textarea.displayName = "Textarea";
