"use client";

import type { PollType } from "@/types/poll";
import { Badge } from "@/components/ui/Badge";

const TYPES: { value: PollType; label: string; description: string }[] = [
  { value: "single_choice", label: "Choix unique", description: "Une seule option" },
  {
    value: "multiple_choice",
    label: "Choix multiple",
    description: "Plusieurs options (limite configurable)",
  },
  { value: "rating", label: "Notation", description: "Échelle 1 à 5 étoiles" },
  { value: "yes_no", label: "Oui / Non", description: "Réponse binaire" },
];

interface PollTypeSelectorProps {
  value: PollType;
  onChange: (type: PollType) => void;
}

export function PollTypeSelector({ value, onChange }: PollTypeSelectorProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {TYPES.map((t) => (
        <button
          key={t.value}
          type="button"
          onClick={() => onChange(t.value)}
          className={`rounded-xl border p-4 text-left transition-colors ${
            value === t.value
              ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40"
              : "border-zinc-200 hover:border-zinc-300 dark:border-zinc-800"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-medium">{t.label}</span>
            {value === t.value && <Badge>Actif</Badge>}
          </div>
          <p className="mt-1 text-sm text-zinc-500">{t.description}</p>
        </button>
      ))}
    </div>
  );
}
