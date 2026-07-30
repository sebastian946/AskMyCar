export function TypingIndicator() {
  return (
    <div
      className="inline-flex items-center gap-1.5 rounded-2xl rounded-bl-sm border border-base-800 bg-base-900 px-4 py-3"
      role="status"
      aria-label="El asistente esta escribiendo"
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="size-1.5 rounded-full bg-accent-400 animate-typing-dot"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  );
}
