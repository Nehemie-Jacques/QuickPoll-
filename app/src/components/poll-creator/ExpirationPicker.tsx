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
      <p className="text-xs font-medium uppercase tracking-wider text-[var(--text-label)]">
        Expiration
      </p>
      <div className="flex flex-wrap gap-1 rounded-lg border border-[var(--border-card)] bg-[var(--bg-elevated)] p-1">
        {PRESETS.map((p) => (
          <button
            key={p.value}
            type="button"
            onClick={() => onExpirationChange(p.value)}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
              expiration === p.value
                ? "bg-violet-600 text-white"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
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
