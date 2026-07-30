import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Car, MailPlus } from "lucide-react";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { BRANDS } from "../data/brands";

export function UnsupportedBrandPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const brand = params.get("marca") ?? "esa marca";
  const availableBrands = BRANDS.filter((b) => b.available).map((b) => b.label);

  return (
    <div className="mx-auto flex w-full max-w-lg flex-1 flex-col items-center justify-center px-4 py-16 text-center">
      <Card className="flex flex-col items-center gap-5 p-8 animate-rise-in">
        <span className="flex size-12 items-center justify-center rounded-full bg-tel-500/15 text-tel-400">
          <Car className="size-6" />
        </span>

        <div className="flex flex-col gap-2">
          <h1 className="font-display text-xl font-semibold text-base-50">
            {brand} llega pronto
          </h1>
          <p className="max-w-sm text-sm text-base-400">
            Todavia no tenemos soporte para {brand}, pero estamos trabajando en sumar mas
            marcas. Por ahora podes probar AskMyCar con:{" "}
            <span className="font-medium text-base-200">{availableBrands.join(", ")}</span>.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button icon={<ArrowLeft className="size-4" />} onClick={() => navigate("/vehiculo")}>
            Elegir otra marca
          </Button>
          <Button variant="secondary" icon={<MailPlus className="size-4" />}>
            Avisenme cuando este
          </Button>
        </div>
      </Card>
    </div>
  );
}
