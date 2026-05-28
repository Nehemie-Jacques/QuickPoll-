"use client";

import type { ExpirationPreset } from "@/types/poll";
import { Input } from "@/components/ui/Input";

const PRESETS: { value: ExpirationPreset; label: string }[] = [
  { value: "1h", label: "1 heure" },
  { value: "6h", label: "6 heures" },
  { value: "24h", label: "24 heures" },
  { value: "7d", label: "7 jours" },
  { value: "custom", label: "Date personnalisée" },
  { value: "none", label: "Sans expiration" },
];

interface ExpirationPickerProps {
  expiration: ExpirationPreset;
  customExpiresAt: string;
  onExpirationChange: (v: ExpirationPreset) => void;
  onCustomChange: (v: string) => void;
}

export function ExpirationPicker({
  expiration,
  customExpiresAt,
  onExpirationChange,
  onCustomChange,
}: ExpirationPickerProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Expiration</label>
      <div className="flex flex-wrap gap-2">
        {PRESETS.map((p) => (
          <button
            key={p.value}
            type="button"
            onClick={() => onExpirationChange(p.value)}
            className={`rounded-full px-3 py-1 text-sm ${
              expiration === p.value
                ? "bg-indigo-600 text-white"
                : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>
      {expiration === "custom" && (
        <Input
          type="datetime-local"
          value={customExpiresAt}
          onChange={(e) => onCustomChange(e.target.value)}
        />
      )}
    </div>
  );
}
