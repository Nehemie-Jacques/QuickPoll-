"use client";

import type { PollOption } from "@/types/poll";

export function MultipleChoice({
  options,
  value,
  maxChoices,
  onChange,
}: {
  options: PollOption[];
  value: string[];
  maxChoices: number;
  accentColor: string;
  onChange: (ids: string[]) => void;
}) {
  function toggle(id: string) {
    if (value.includes(id)) onChange(value.filter((v) => v !== id));
    else if (value.length < maxChoices) onChange([...value, id]);
  }

  return (
    <div className="space-y-2">
      <p className="text-xs text-[var(--text-muted)]">Select up to {maxChoices}</p>
      {options.map((opt) => {
        const selected = value.includes(opt.id);
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => toggle(opt.id)}
            className={`flex w-full items-center justify-between rounded-xl border px-4 py-4 text-left transition ${
              selected
                ? "qp-option-selected"
                : "border-[var(--border-card)] bg-[var(--bg-surface)] hover:bg-violet-600/5"
            }`}
          >
            <span className="min-w-0 truncate font-medium text-[var(--text-primary)]">{opt.label}</span>
            <span
              className={`flex size-5 shrink-0 items-center justify-center rounded border ${
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
