import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { BrandPicker } from "../components/BrandPicker";
import type { BrandOption } from "../data/brands";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { ManualLoadingCard } from "../components/ManualLoadingCard";
import { ErrorState } from "../components/ErrorState";
import { useVehicle } from "../context/useVehicle";
import type { ManualLoadPhase } from "../types";
import { getManual } from "../../api/services/car_services";

const YEAR_PATTERN = /^\d{4}$/;

export function VehicleSelectPage() {
  const navigate = useNavigate();
  const { setCar } = useVehicle();

  const [brand, setBrand] = useState<string | null>("renault");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [yearError, setYearError] = useState<string | undefined>();
  const [phase, setPhase] = useState<ManualLoadPhase>("idle");
  const scrapingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleUnavailableBrand(option: BrandOption) {
    navigate(`/marca-no-disponible?marca=${encodeURIComponent(option.label)}`);
  }

  async function handleSubmit() {
    if (!brand || !model.trim()) return;
    if (!YEAR_PATTERN.test(year)) {
      setYearError('El año va solo con 4 dígitos, ej. "2019" (sin mes).');
      return;
    }
    setYearError(undefined);

    const car = { brand, model: model.trim(), year };
    setPhase("checking");

    // Heuristic: if the check takes longer than a beat, assume we're mid-scrape
    // and switch the copy so the user knows why it's taking a while.
    scrapingTimer.current = setTimeout(() => setPhase("scraping"), 1100);

    try {
      const result = await getManual(car);
      if (scrapingTimer.current) clearTimeout(scrapingTimer.current);
      setPhase("ready");
      setCar(result.car);
      navigate("/chat");
    } catch {
      if (scrapingTimer.current) clearTimeout(scrapingTimer.current);
      setPhase("error");
    }
  }

  if (phase === "checking" || phase === "scraping") {
    return (
      <div className="flex flex-1 items-center justify-center px-4 py-16">
        <ManualLoadingCard phase={phase} />
      </div>
    );
  }

  if (phase === "error") {
    return (
      <div className="flex flex-1 items-center justify-center px-4 py-16">
        <ErrorState
          title="No pudimos obtener el manual"
          description="Volvé a intentar en un momento. Si el problema sigue, puede que el modelo/año no exista en el sitio del fabricante."
          onRetry={() => setPhase("idle")}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center px-4 py-12">
      <div className="mb-8 flex flex-col gap-2 text-center animate-rise-in">
        <h1 className="font-display text-2xl font-semibold text-base-50 sm:text-3xl">
          Contanos cual es tu auto
        </h1>
        <p className="text-sm text-base-400">
          Buscamos el manual oficial para responderte con precision.
        </p>
      </div>

      <Card className="flex flex-col gap-6 p-6 animate-rise-in">
        <div className="flex flex-col gap-2.5">
          <span className="text-sm font-medium text-base-300">Marca</span>
          <BrandPicker
            value={brand}
            onSelect={(b) => setBrand(b.id)}
            onSelectUnavailable={handleUnavailableBrand}
          />
        </div>

        <Input
          label="Modelo"
          placeholder="Ej. Sandero"
          value={model}
          onChange={(e) => setModel(e.target.value)}
        />

        <Input
          label="Año"
          placeholder="Ej. 2019"
          inputMode="numeric"
          maxLength={4}
          value={year}
          error={yearError}
          onChange={(e) => setYear(e.target.value.replace(/\D/g, ""))}
        />

        <Button
          size="lg"
          icon={<ArrowRight className="size-4" />}
          disabled={!brand || !model.trim() || year.length !== 4}
          onClick={handleSubmit}
          className="flex-row-reverse"
        >
          Buscar manual
        </Button>
      </Card>
    </div>
  );
}
