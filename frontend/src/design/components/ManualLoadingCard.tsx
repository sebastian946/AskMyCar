import { Search, Wrench } from "lucide-react";
import type { ManualLoadPhase } from "../types";
import { GaugeSpinner } from "./GaugeSpinner";
import { cn } from "../../lib/cn";

const COPY: Record<"checking" | "scraping", { title: string; desc: string; icon: typeof Search }> = {
  checking: {
    title: "Buscando tu manual...",
    desc: "Estamos revisando si ya tenemos el manual de tu vehiculo.",
    icon: Search,
  },
  scraping: {
    title: "No lo teniamos a mano",
    desc: "Lo estamos descargando del sitio oficial del fabricante. Esto puede tardar unos segundos, no cierres la pagina.",
    icon: Wrench,
  },
};

export function ManualLoadingCard({ phase }: { phase: Extract<ManualLoadPhase, "checking" | "scraping"> }) {
  const { title, desc, icon: Icon } = COPY[phase];

  return (
    <div className="flex flex-col items-center gap-5 rounded-2xl border border-base-800 bg-base-900/80 px-8 py-10 text-center animate-rise-in">
      <GaugeSpinner size={88} />
      <div className="flex flex-col items-center gap-2">
        <div
          className={cn(
            "flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide",
            phase === "checking" ? "text-tel-400" : "text-accent-400",
          )}
        >
          <Icon className="size-3.5" />
          {phase === "checking" ? "Paso 1 de 2" : "Paso 2 de 2"}
        </div>
        <h3 className="font-display text-lg font-semibold text-base-50">{title}</h3>
        <p className="max-w-xs text-sm text-base-400">{desc}</p>
      </div>
    </div>
  );
}
