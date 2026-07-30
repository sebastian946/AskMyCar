import type { ReactNode } from "react";
import { cn } from "../../lib/cn";

type Tone = "neutral" | "accent" | "ok" | "warn" | "danger" | "tel";

const toneClasses: Record<Tone, string> = {
  neutral: "bg-base-800 text-base-300 border-base-700",
  accent: "bg-accent-500/15 text-accent-300 border-accent-500/30",
  ok: "bg-ok-500/15 text-ok-400 border-ok-500/30",
  warn: "bg-warn-500/15 text-warn-500 border-warn-500/30",
  danger: "bg-danger-500/15 text-danger-400 border-danger-500/30",
  tel: "bg-tel-500/15 text-tel-400 border-tel-500/30",
};

export function Badge({
  tone = "neutral",
  icon,
  children,
  className,
}: {
  tone?: Tone;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium",
        toneClasses[tone],
        className,
      )}
    >
      {icon}
      {children}
    </span>
  );
}
