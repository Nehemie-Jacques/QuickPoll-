"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface OptionsListProps {
  options: string[];
  onChange: (options: string[]) => void;
  showOptions: boolean;
}

export function OptionsList({ options, onChange, showOptions }: OptionsListProps) {
  if (!showOptions) return null;

  function update(index: number, value: string) {
    const next = [...options];
    next[index] = value;
    onChange(next);
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Options</label>
      {options.map((opt, i) => (
        <div key={i} className="flex gap-2">
          <Input
            value={opt}
            placeholder={`Option ${i + 1}`}
            onChange={(e) => update(i, e.target.value)}
          />
          {options.length > 2 && (
            <Button
              type="button"
              variant="ghost"
              onClick={() => onChange(options.filter((_, j) => j !== i))}
            >
              ✕
            </Button>
          )}
        </div>
      ))}
      <Button
        type="button"
        variant="secondary"
        onClick={() => onChange([...options, ""])}
      >
        + Ajouter une option
      </Button>
    </div>
  );
}
