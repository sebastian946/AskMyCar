import { Gauge } from "lucide-react";
import { cn } from "../../lib/cn";

export function GaugeSpinner({
  size = 96,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <div
      className={cn("relative shrink-0", className)}
      style={{ width: size, height: size }}
      role="status"
      aria-label="Cargando"
    >
      <div className="gauge-ring absolute inset-0 rounded-full" />
      <div
        className="absolute inset-3 rounded-full bg-accent-500/10 animate-glow-pulse"
        style={{ boxShadow: "0 0 32px 4px rgba(242,104,15,0.35)" }}
      />
      <div className="absolute inset-0 flex items-center justify-center animate-needle-sweep">
        <div className="h-[38%] w-[3px] -translate-y-[18%] rounded-full bg-linear-to-t from-accent-500 to-accent-300" />
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex size-9 items-center justify-center rounded-full bg-base-900 border border-base-700 text-accent-400">
          <Gauge className="size-4" />
        </div>
      </div>
    </div>
  );
}
