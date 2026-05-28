"use client";

import type { PollOption } from "@/types/poll";

interface MultipleChoiceProps {
  options: PollOption[];
  value: string[];
  maxChoices: number;
  accentColor: string;
  onChange: (optionIds: string[]) => void;
}

export function MultipleChoice({
  options,
  value,
  maxChoices,
  accentColor,
  onChange,
}: MultipleChoiceProps) {
  function toggle(id: string) {
    if (value.includes(id)) {
      onChange(value.filter((v) => v !== id));
      return;
    }
    if (value.length >= maxChoices) return;
    onChange([...value, id]);
  }

  return (
    <div className="space-y-2">
      <p className="text-sm text-zinc-500">
        Sélectionnez jusqu&apos;à {maxChoices} option(s)
      </p>
      {options.map((opt) => {
        const selected = value.includes(opt.id);
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => toggle(opt.id)}
            className={`w-full rounded-lg border p-4 text-left ${
              selected ? "border-2" : "border-zinc-200 dark:border-zinc-800"
            }`}
            style={
              selected
                ? { borderColor: accentColor, backgroundColor: `${accentColor}15` }
                : undefined
            }
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
