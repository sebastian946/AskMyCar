import { Car as CarIcon, RefreshCw } from "lucide-react";
import type { Car } from "../types";

export function VehicleChip({ car, onChange }: { car: Car; onChange?: () => void }) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-base-700 bg-base-850 py-1 pl-1 pr-1.5">
      <span className="flex size-7 items-center justify-center rounded-full bg-accent-500/15 text-accent-400">
        <CarIcon className="size-3.5" />
      </span>
      <span className="text-sm font-medium capitalize text-base-100">
        {car.brand} {car.model} <span className="text-base-400">'{car.year}</span>
      </span>
      {onChange && (
        <button
          type="button"
          onClick={onChange}
          className="ml-1 flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium text-base-400 hover:bg-base-800 hover:text-accent-300 transition-colors"
        >
          <RefreshCw className="size-3" />
          Cambiar
        </button>
      )}
    </div>
  );
}
