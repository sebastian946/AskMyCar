import { useContext } from "react";
import { VehicleContext, type VehicleContextValue } from "./vehicle-context";

export function useVehicle(): VehicleContextValue {
  const ctx = useContext(VehicleContext);
  if (!ctx) throw new Error("useVehicle must be used within a VehicleProvider");
  return ctx;
}
