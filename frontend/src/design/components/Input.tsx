import type { InputHTMLAttributes } from "react";
import { cn } from "../../lib/cn";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function Input({ label, error, id, className, ...rest }: InputProps) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={inputId} className="text-sm font-medium text-base-300">
        {label}
      </label>
      <input
        id={inputId}
        className={cn(
          "rounded-xl border bg-base-900 px-4 py-2.5 text-sm text-base-100 placeholder:text-base-600",
          "outline-none transition-colors focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20",
          error ? "border-danger-500/60" : "border-base-700",
          className,
        )}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : undefined}
        {...rest}
      />
      {error && (
        <p id={`${inputId}-error`} className="text-xs text-danger-400">
          {error}
        </p>
      )}
    </div>
  );
}
