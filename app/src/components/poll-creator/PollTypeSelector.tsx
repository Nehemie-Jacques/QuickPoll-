"use client";

import type { PollType } from "@/types/poll";

const TYPES: {
  value: PollType;
  label: string;
  icon: string;
}[] = [
  { value: "single_choice", label: "Single choice", icon: "◉" },
  { value: "multiple_choice", label: "Multiple choice", icon: "☑" },
  { value: "rating", label: "Rating", icon: "★" },
  { value: "yes_no", label: "Yes / No", icon: "👍" },
];

export function PollTypeSelector({
  value,
  onChange,
}: {
  value: PollType;
  onChange: (t: PollType) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {TYPES.map((t) => {
        const selected = value === t.value;
        return (
          <button
            key={t.value}
            type="button"
            onClick={() => onChange(t.value)}
            className={`flex min-h-[108px] flex-col items-center justify-center rounded-xl border p-4 text-center transition ${
              selected
                ? "qp-option-selected border-violet-600"
                : "border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-violet-600/50"
            }`}
          >
            <span className="text-3xl leading-none" aria-hidden>
              {t.icon}
            </span>
            <p className="mt-3 text-sm font-semibold text-[var(--text-primary)]">
              {t.label}
            </p>
          </button>
        );
      })}
    </div>
  );
}
