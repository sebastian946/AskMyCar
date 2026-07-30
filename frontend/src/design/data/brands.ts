export interface BrandOption {
  id: string;
  label: string;
  available: boolean;
}

export const BRANDS: BrandOption[] = [
  { id: "renault", label: "Renault", available: true },
  { id: "chevrolet", label: "Chevrolet", available: false },
  { id: "toyota", label: "Toyota", available: false },
  { id: "volkswagen", label: "Volkswagen", available: false },
  { id: "ford", label: "Ford", available: false },
  { id: "peugeot", label: "Peugeot", available: false },
];
