import { createContext } from "react";
import type { Car } from "../types";

export interface VehicleContextValue {
  car: Car | null;
  setCar: (car: Car | null) => void;
}

export const VehicleContext = createContext<VehicleContextValue | null>(null);
