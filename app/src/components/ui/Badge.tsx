import type { ReactNode } from "react";

type Tone = "violet" | "live" | "muted" | "warning" | "gold";

const tones: Record<Tone, string> = {
  violet: "bg-violet-600/20 text-violet-300 border-violet-500/30",
  live: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  muted: "bg-zinc-800 text-zinc-400 border-zinc-700",
  warning: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  gold: "bg-amber-500/20 text-amber-300 border-amber-500/40",
};

export function Badge({
  children,
  tone = "violet",
  className = "",
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium uppercase tracking-wider ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
