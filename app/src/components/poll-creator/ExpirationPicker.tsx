"use client";

import type { ExpirationPreset } from "@/types/poll";
import { Input } from "@/components/ui/Input";

const PRESETS: { value: ExpirationPreset; label: string }[] = [
  { value: "1h", label: "1h" },
  { value: "6h", label: "6h" },
  { value: "24h", label: "24h" },
  { value: "7d", label: "7 days" },
  { value: "custom", label: "Custom" },
  { value: "none", label: "Never" },
];

export function ExpirationPicker({
  expiration,
  customExpiresAt,
  onExpirationChange,
  onCustomChange,
}: {
  expiration: ExpirationPreset;
  customExpiresAt: string;
  onExpirationChange: (v: ExpirationPreset) => void;
  onCustomChange: (v: string) => void;
}) {
  return (
    <div className="space-y-3">
      <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
        Expiration
      </p>
      <div className="flex flex-wrap gap-1 rounded-lg bg-zinc-900 p-1">
        {PRESETS.map((p) => (
          <button
            key={p.value}
            type="button"
            onClick={() => onExpirationChange(p.value)}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
              expiration === p.value
                ? "bg-violet-600 text-white"
                : "text-zinc-400 hover:text-zinc-200"
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
