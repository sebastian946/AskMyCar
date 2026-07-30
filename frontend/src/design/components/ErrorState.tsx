import { AlertTriangle } from "lucide-react";
import { Button } from "./Button";

export function ErrorState({
  title = "Algo salio mal",
  description = "No pudimos completar la solicitud. Puede ser un problema temporal.",
  onRetry,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl border border-danger-500/30 bg-danger-500/5 px-8 py-10 text-center animate-rise-in">
      <div className="flex size-12 items-center justify-center rounded-full bg-danger-500/15 text-danger-400">
        <AlertTriangle className="size-6" />
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="font-display text-lg font-semibold text-base-50">{title}</h3>
        <p className="max-w-xs text-sm text-base-400">{description}</p>
      </div>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry}>
          Reintentar
        </Button>
      )}
    </div>
  );
}
