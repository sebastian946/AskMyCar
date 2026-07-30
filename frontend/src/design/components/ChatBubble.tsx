import { useState } from "react";
import { BookOpenText, ChevronDown, User } from "lucide-react";
import type { ChatMessage } from "../types";
import { cn } from "../../lib/cn";

export function ChatBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";
  const [sourcesOpen, setSourcesOpen] = useState(false);

  return (
    <div
      className={cn(
        "flex w-full gap-3 animate-rise-in",
        isUser ? "flex-row-reverse" : "flex-row",
      )}
    >
      <div
        className={cn(
          "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full border",
          isUser
            ? "bg-base-800 border-base-700 text-base-300"
            : "bg-accent-500/15 border-accent-500/30 text-accent-400",
        )}
      >
        {isUser ? <User className="size-4" /> : <BookOpenText className="size-4" />}
      </div>

      <div className={cn("max-w-[80%] flex flex-col gap-2", isUser && "items-end")}>
        <div
          className={cn(
            "rounded-2xl px-4 py-3 text-sm leading-relaxed",
            isUser
              ? "rounded-br-sm bg-accent-500 text-base-950 font-medium"
              : "rounded-bl-sm border border-base-800 bg-base-900 text-base-100",
          )}
        >
          {message.text}
        </div>

        {!isUser && message.sources && message.sources.length > 0 && (
          <div className="w-full">
            <button
              type="button"
              onClick={() => setSourcesOpen((open) => !open)}
              className="flex items-center gap-1.5 text-xs font-medium text-base-400 hover:text-accent-300 transition-colors"
            >
              <ChevronDown
                className={cn("size-3.5 transition-transform", sourcesOpen && "rotate-180")}
              />
              {sourcesOpen ? "Ocultar fuentes del manual" : `Ver fuentes del manual (${message.sources.length})`}
            </button>

            {sourcesOpen && (
              <ul className="mt-2 flex flex-col gap-2 animate-rise-in">
                {message.sources.map((source, i) => (
                  <li
                    key={i}
                    className="rounded-xl border border-base-800 bg-base-850/60 px-3 py-2 text-xs text-base-400 leading-relaxed"
                  >
                    {source}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
