import { useMemo, useState, type ReactNode } from "react";
import type { Car } from "../types";
import { VehicleContext } from "./vehicle-context";

export function VehicleProvider({ children }: { children: ReactNode }) {
  const [car, setCar] = useState<Car | null>(null);
  const value = useMemo(() => ({ car, setCar }), [car]);

  return <VehicleContext.Provider value={value}>{children}</VehicleContext.Provider>;
}
