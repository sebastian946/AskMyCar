import { useEffect, useState } from "react";
import { TimerReset } from "lucide-react";

export function RateLimitBanner({
  seconds = 30,
  onExpire,
}: {
  seconds?: number;
  onExpire?: () => void;
}) {
  const [remaining, setRemaining] = useState(seconds);

  useEffect(() => {
    if (remaining <= 0) {
      onExpire?.();
      return;
    }
    const id = setTimeout(() => setRemaining((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [remaining, onExpire]);

  return (
    <div className="flex items-center gap-3 rounded-xl border border-warn-500/30 bg-warn-500/10 px-4 py-3 text-sm text-warn-500 animate-rise-in">
      <TimerReset className="size-4 shrink-0" />
      <p className="flex-1">
        Hiciste demasiadas preguntas seguidas. Esperá{" "}
        <span className="font-semibold tabular-nums">{remaining}s</span> para volver a intentar.
      </p>
    </div>
  );
}
