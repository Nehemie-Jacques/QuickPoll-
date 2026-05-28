"use client";

interface YesNoProps {
  value: boolean | null;
  accentColor: string;
  onChange: (value: boolean) => void;
}

export function YesNo({ value, accentColor, onChange }: YesNoProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {[
        { label: "Oui", v: true },
        { label: "Non", v: false },
      ].map(({ label, v }) => (
        <button
          key={label}
          type="button"
          onClick={() => onChange(v)}
          className={`rounded-xl border-2 py-8 text-xl font-semibold ${
            value === v ? "" : "border-zinc-200 dark:border-zinc-800"
          }`}
          style={
            value === v
              ? { borderColor: accentColor, color: accentColor }
              : undefined
          }
        >
          {label}
        </button>
      ))}
    </div>
  );
}
