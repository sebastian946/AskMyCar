/**
 * Shapes mirror the backend contract described in the project README
 * (POST /askmycar/get_manual, POST /askmycar/chat_ai). Kept here so the real
 * API integration can reuse them as-is instead of redefining response types.
 */

export interface Car {
  brand: string;
  model: string;
  year: string;
}

export interface ManualResponse {
  status: "found" | "scraped";
  car: Car;
  message: string;
}

export interface ChatResponse {
  car: Car;
  question: string;
  answer: string;
  sources: string[];
}

export type ChatRole = "user" | "assistant";

export interface ChatMessage {
  id: string;
  role: ChatRole;
  text: string;
  sources?: string[];
}

export type ManualLoadPhase =
  | "idle"
  | "checking"
  | "scraping"
  | "ready"
  | "error";
