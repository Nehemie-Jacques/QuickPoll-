"use client";

import type { PollOption } from "@/types/poll";

interface SingleChoiceProps {
  options: PollOption[];
  value: string | null;
  accentColor: string;
  onChange: (optionId: string) => void;
}

export function SingleChoice({
  options,
  value,
  accentColor,
  onChange,
}: SingleChoiceProps) {
  return (
    <div className="space-y-2">
      {options.map((opt) => (
        <button
          key={opt.id}
          type="button"
          onClick={() => onChange(opt.id)}
          className={`w-full rounded-lg border p-4 text-left transition-colors ${
            value === opt.id ? "border-2" : "border-zinc-200 dark:border-zinc-800"
          }`}
          style={
            value === opt.id
              ? { borderColor: accentColor, backgroundColor: `${accentColor}15` }
              : undefined
          }
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
