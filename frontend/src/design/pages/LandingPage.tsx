import { useNavigate } from "react-router-dom";
import { BookOpenText, MessageCircle, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "../components/Button";
import { Card } from "../components/Card";

const FEATURES = [
  {
    icon: BookOpenText,
    title: "El manual real de tu auto",
    desc: "Buscamos el manual oficial del fabricante para tu marca, modelo y año exactos.",
  },
  {
    icon: MessageCircle,
    title: "Preguntale como a un mecanico",
    desc: 'Escribi "cada cuanto cambio el aceite" y listo, sin buscar en 300 paginas de PDF.',
  },
  {
    icon: ShieldCheck,
    title: "Respuestas con fuente",
    desc: "Cada respuesta muestra el fragmento exacto del manual del que sale.",
  },
];

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="relative flex flex-1 flex-col items-center overflow-hidden px-4 pb-24 pt-16 sm:pt-24">
      <div
        className="gauge-ring pointer-events-none absolute left-1/2 top-10 size-[480px] -translate-x-1/2 opacity-40 sm:size-[620px]"
        aria-hidden
      />

      <div className="relative flex flex-col items-center gap-6 text-center animate-rise-in">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-accent-500/30 bg-accent-500/10 px-3 py-1 text-xs font-medium text-accent-300">
          <Sparkles className="size-3.5" />
          Respuestas de tu manual, al instante
        </span>

        <h1 className="max-w-2xl font-display text-4xl font-semibold leading-tight text-base-50 sm:text-5xl">
          Dejá de buscar en el <span className="text-accent-400">manual de papel</span>.
          <br />
          Preguntale a tu auto.
        </h1>

        <p className="max-w-lg text-base text-base-400 sm:text-lg">
          AskMyCar lee el manual oficial de tu vehiculo y te responde cualquier duda al
          instante: mantenimiento, luces de aviso, capacidades, y mas.
        </p>

        <div className="mt-2 flex flex-col gap-3 sm:flex-row">
          <Button size="lg" onClick={() => navigate("/vehiculo")}>
            Buscar mi manual
          </Button>
          <Button size="lg" variant="secondary" onClick={() => navigate("/vehiculo")}>
            Ver como funciona
          </Button>
        </div>
      </div>

      <div className="relative mt-20 grid w-full max-w-4xl gap-4 sm:grid-cols-3">
        {FEATURES.map(({ icon: Icon, title, desc }, i) => (
          <Card
            key={title}
            className="animate-rise-in flex flex-col gap-3 p-6"
            style={{ animationDelay: `${i * 0.08}s` }}
          >
            <span className="flex size-10 items-center justify-center rounded-xl bg-accent-500/15 text-accent-400">
              <Icon className="size-5" />
            </span>
            <h3 className="font-display text-base font-semibold text-base-50">{title}</h3>
            <p className="text-sm text-base-400">{desc}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
