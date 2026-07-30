import { Car as CarIcon, Clock } from "lucide-react";
import { cn } from "../../lib/cn";
import { BRANDS, type BrandOption } from "../data/brands";

export function BrandPicker({
  value,
  onSelect,
  onSelectUnavailable,
}: {
  value: string | null;
  onSelect: (brand: BrandOption) => void;
  onSelectUnavailable: (brand: BrandOption) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {BRANDS.map((brand) => {
        const selected = value === brand.id;
        return (
          <button
            key={brand.id}
            type="button"
            onClick={() => (brand.available ? onSelect(brand) : onSelectUnavailable(brand))}
            className={cn(
              "group relative flex flex-col items-center gap-2 rounded-2xl border px-4 py-5 transition-all",
              selected
                ? "border-accent-500 bg-accent-500/10"
                : "border-base-800 bg-base-900 hover:border-base-600",
              !brand.available && "opacity-60 hover:opacity-90",
            )}
          >
            {!brand.available && (
              <span className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-base-800 px-2 py-0.5 text-[10px] font-medium text-base-400">
                <Clock className="size-2.5" />
                Pronto
              </span>
            )}
            <span
              className={cn(
                "flex size-10 items-center justify-center rounded-full border",
                selected
                  ? "border-accent-500/50 bg-accent-500/15 text-accent-400"
                  : "border-base-700 bg-base-850 text-base-400 group-hover:text-base-200",
              )}
            >
              <CarIcon className="size-5" />
            </span>
            <span className="text-sm font-medium text-base-100">{brand.label}</span>
          </button>
        );
      })}
    </div>
  );
}
