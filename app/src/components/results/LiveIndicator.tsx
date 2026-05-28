"use client";

export function LiveIndicator({ connected }: { connected: boolean }) {
  return (
    <span className="inline-flex items-center gap-2 text-sm">
      <span
        className={`size-2 rounded-full ${connected ? "animate-pulse bg-emerald-500" : "bg-zinc-400"}`}
      />
      {connected ? "En direct" : "Hors ligne"}
    </span>
  );
}
