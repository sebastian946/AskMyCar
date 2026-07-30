import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Send, Sparkles } from "lucide-react";
import { useVehicle } from "../context/useVehicle";
import { ChatBubble } from "../components/ChatBubble";
import { TypingIndicator } from "../components/TypingIndicator";
import { RateLimitBanner } from "../components/RateLimitBanner";
import { ErrorState } from "../components/ErrorState";
import { Button } from "../components/Button";
import { askQuestion, FakeApiError } from "../mock/fakeApi";
import type { ChatMessage } from "../types";

const SUGGESTIONS = [
  "Cada cuanto se cambia el aceite?",
  "Que significa la luz naranja del tablero?",
  "Cual es la presion recomendada de los neumaticos?",
];

type SendState = "idle" | "sending" | "rate-limited" | "error";

export function ChatPage() {
  const { car } = useVehicle();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [sendState, setSendState] = useState<SendState>("idle");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!car) navigate("/vehiculo", { replace: true });
  }, [car, navigate]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sendState]);

  if (!car) return null;

  async function send(question: string) {
    const trimmed = question.trim();
    if (!trimmed || sendState === "sending" || !car) return;

    setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: "user", text: trimmed }]);
    setInput("");
    setSendState("sending");

    try {
      const result = await askQuestion(car, trimmed);
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: "assistant", text: result.answer, sources: result.sources },
      ]);
      setSendState("idle");
    } catch (err) {
      setSendState(err instanceof FakeApiError && err.kind === "rate-limited" ? "rate-limited" : "error");
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4">
      <div className="flex-1 overflow-y-auto py-8">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-12 text-center animate-rise-in">
            <span className="flex size-12 items-center justify-center rounded-full bg-accent-500/15 text-accent-400">
              <Sparkles className="size-6" />
            </span>
            <div className="flex flex-col gap-1">
              <h2 className="font-display text-lg font-semibold text-base-50">
                Preguntame lo que quieras sobre tu {car.model}
              </h2>
              <p className="text-sm text-base-400">
                Respondo en base al manual oficial de tu {car.brand} {car.model} {car.year}.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-2 pt-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => send(s)}
                  className="rounded-full border border-base-700 bg-base-900 px-3.5 py-2 text-xs text-base-300 transition-colors hover:border-accent-500/50 hover:text-accent-300"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {messages.map((m) => (
              <ChatBubble key={m.id} message={m} />
            ))}
            {sendState === "sending" && (
              <div className="flex gap-3">
                <div className="size-8 shrink-0" />
                <TypingIndicator />
              </div>
            )}
            {sendState === "rate-limited" && (
              <RateLimitBanner onExpire={() => setSendState("idle")} />
            )}
            {sendState === "error" && (
              <ErrorState
                title="No pudimos responder"
                description="Hubo un problema al consultar el manual. Intenta de nuevo."
                onRetry={() => setSendState("idle")}
              />
            )}
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      <div className="sticky bottom-0 border-t border-base-800/80 bg-base-950/90 py-4 backdrop-blur-md">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="flex items-center gap-2"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribi tu pregunta sobre el manual..."
            disabled={sendState === "sending"}
            className="flex-1 rounded-xl border border-base-700 bg-base-900 px-4 py-3 text-sm text-base-100 outline-none placeholder:text-base-600 focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20 disabled:opacity-60"
          />
          <Button
            type="submit"
            icon={<Send className="size-4" />}
            loading={sendState === "sending"}
            disabled={!input.trim()}
            aria-label="Enviar pregunta"
          />
        </form>
      </div>
    </div>
  );
}
