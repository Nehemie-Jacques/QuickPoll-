"use client";

import type { PollOption } from "@/types/poll";

export function SingleChoice({
  options,
  value,
  accentColor,
  onChange,
}: {
  options: PollOption[];
  value: string | null;
  accentColor: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="space-y-2">
      {options.map((opt) => {
        const selected = value === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id)}
            className={`flex w-full items-center justify-between rounded-xl border px-4 py-4 text-left transition ${
              selected
                ? "qp-option-selected"
                : "border-[var(--border-card)] bg-[var(--bg-surface)] hover:bg-violet-600/5 hover:border-violet-600/50"
            }`}
            style={
              selected
                ? { borderLeftColor: accentColor }
                : undefined
            }
          >
            <span className="font-medium text-[var(--text-primary)]">{opt.label}</span>
            <span
              className={`flex size-5 items-center justify-center rounded-full border-2 ${
                selected ? "border-violet-500 bg-violet-600 text-white" : "border-[var(--border-card)]"
              }`}
            >
              {selected && "✓"}
            </span>
          </button>
        );
      })}
    </div>
  );
}
