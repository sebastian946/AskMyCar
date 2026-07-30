import type { ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Gauge } from "lucide-react";
import { useVehicle } from "../context/useVehicle";
import { VehicleChip } from "../components/VehicleChip";

export function AppShell({ children }: { children: ReactNode }) {
  const { car } = useVehicle();
  const navigate = useNavigate();

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-10 border-b border-base-800/80 bg-base-950/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
          <Link to="/" className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-lg bg-accent-500 text-base-950">
              <Gauge className="size-4.5" strokeWidth={2.5} />
            </span>
            <span className="font-display text-base font-semibold tracking-tight text-base-50">
              AskMyCar
            </span>
          </Link>

          {car && <VehicleChip car={car} onChange={() => navigate("/vehiculo")} />}
        </div>
      </header>

      <main className="flex flex-1 flex-col">{children}</main>
    </div>
  );
}
