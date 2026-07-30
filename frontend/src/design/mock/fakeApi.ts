import type { Car, ChatResponse, ManualResponse } from "../types";

/**
 * DEMO-ONLY fake API layer.
 *
 * This file exists purely so the design/prototype is navigable and shows
 * realistic loading states without a backend. It intentionally does not
 * call `fetch`, does not send `X-API-KEY`, and does not handle real error
 * codes (400/401/429/502).
 *
 * TODO(you): replace the bodies of `checkOrScrapeManual` and `askQuestion`
 * with real calls to POST /askmycar/get_manual and POST /askmycar/chat_ai
 * (see README.md at the repo root for the exact contract). The return
 * types already match the backend response shapes, so swapping the
 * implementation shouldn't require touching any component.
 */

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Mirrors the shape of errors the real API can return (429, 502, network). */
export class FakeApiError extends Error {
  kind: "rate-limited" | "network";
  constructor(kind: "rate-limited" | "network") {
    super(kind);
    this.kind = kind;
  }
}

let questionCount = 0;

const SAMPLE_SOURCES = [
  "Cambio de aceite y filtro: cada 10.000 km o 12 meses, lo que ocurra primero. Utilizar aceite 5W-30 homologado.",
  "Ante la luz de aviso de presion de aceite, detenga el vehiculo de forma segura y no continue circulando.",
  "La capacidad del carter es de 4.3 litros incluyendo el filtro. Verificar el nivel con el motor frio.",
];

/** Simulates POST /askmycar/get_manual. "found" for common cars, "scraped" (slower) otherwise. */
export async function checkOrScrapeManual(car: Car): Promise<ManualResponse> {
  const isKnown = car.model.trim().toLowerCase() === "sandero";

  if (isKnown) {
    await wait(700);
    return {
      status: "found",
      car,
      message: `El manual de ${car.brand} ${car.model} ${car.year} ya estaba disponible en S3`,
    };
  }

  await wait(3200);
  return {
    status: "scraped",
    car,
    message: `Manual descargado y subido a S3: ${car.brand}/${car.model}/${car.year}/manual.pdf`,
  };
}

/**
 * Simulates POST /askmycar/chat_ai. Every 4th question simulates hitting the
 * real 10/minute rate limit, so the rate-limit UI state is reachable in the
 * demo without touching a real backend.
 */
export async function askQuestion(car: Car, question: string): Promise<ChatResponse> {
  questionCount += 1;
  await wait(1400 + Math.random() * 900);

  if (questionCount % 4 === 0) {
    throw new FakeApiError("rate-limited");
  }

  return {
    car,
    question,
    answer:
      `Segun el manual de tu ${car.brand} ${car.model} ${car.year}, se recomienda cambiar el aceite ` +
      "cada 10.000 km o 12 meses (lo que ocurra primero), usando aceite 5W-30 homologado. " +
      "Si ves la luz de presion de aceite encendida, detene el vehiculo de forma segura.",
    sources: SAMPLE_SOURCES,
  };
}
