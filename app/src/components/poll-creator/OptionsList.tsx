"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { TrashIcon } from "@/components/ui/TrashIcon";

export function OptionsList({
  options,
  onChange,
  showOptions,
  fixed,
}: {
  options: string[];
  onChange: (o: string[]) => void;
  showOptions: boolean;
  fixed?: boolean;
}) {
  if (!showOptions) return null;

  if (fixed) {
    return (
      <div className="space-y-2 rounded-xl border border-dashed border-[var(--border-subtle)] p-4 text-center text-sm text-[var(--text-secondary)]">
        Fixed options: <strong className="text-[var(--text-primary)]">Yes</strong> /{" "}
        <strong className="text-[var(--text-primary)]">No</strong>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {options.map((opt, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="cursor-grab text-[var(--text-muted)]" aria-hidden>
            ⠿
          </span>
          <Input
            value={opt}
            placeholder={`Option ${i + 1}`}
            onChange={(e) => {
              const next = [...options];
              next[i] = e.target.value;
              onChange(next);
            }}
            className="flex-1"
          />
          {options.length > 2 && (
            <button
              type="button"
              className="flex size-9 shrink-0 items-center justify-center rounded-lg text-[var(--text-muted)] transition hover:bg-red-500/10 hover:text-red-500"
              onClick={() => onChange(options.filter((_, j) => j !== i))}
              aria-label={`Remove option ${i + 1}`}
            >
              <TrashIcon />
            </button>
          )}
        </div>
      ))}
      {options.length < 10 && (
        <Button
          type="button"
          variant="ghost"
          className="w-full py-2 text-xs"
          onClick={() => onChange([...options, ""])}
        >
          + Add option
        </Button>
      )}
    </div>
  );
}
