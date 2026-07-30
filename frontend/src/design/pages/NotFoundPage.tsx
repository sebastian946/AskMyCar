import { useNavigate } from "react-router-dom";
import { Compass } from "lucide-react";
import { Button } from "../components/Button";

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-5 px-4 py-16 text-center animate-rise-in">
      <span className="font-display text-7xl font-semibold text-base-800">404</span>
      <div className="flex flex-col gap-1">
        <h1 className="font-display text-xl font-semibold text-base-50">
          Te saliste de ruta
        </h1>
        <p className="text-sm text-base-400">Esta pagina no existe o se movio de lugar.</p>
      </div>
      <Button icon={<Compass className="size-4" />} onClick={() => navigate("/")}>
        Volver al inicio
      </Button>
    </div>
  );
}
