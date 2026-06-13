"use client";

export function YesNo({
  value,
  onChange,
}: {
  value: boolean | null;
  accentColor: string;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <button
        type="button"
        onClick={() => onChange(true)}
        className={`rounded-xl border-2 py-10 transition ${
          value === true
            ? "border-emerald-500 bg-emerald-500/10"
            : "border-[var(--border-card)] bg-[var(--bg-surface)] hover:border-emerald-600/50"
        }`}
      >
        <span className="text-3xl">👍</span>
        <p className="mt-2 text-lg font-semibold text-emerald-500 dark:text-emerald-400">Yes</p>
      </button>
      <button
        type="button"
        onClick={() => onChange(false)}
        className={`rounded-xl border-2 py-10 transition ${
          value === false
            ? "border-red-500 bg-red-500/10"
            : "border-[var(--border-card)] bg-[var(--bg-surface)] hover:border-red-600/50"
        }`}
      >
        <span className="text-3xl">👎</span>
        <p className="mt-2 text-lg font-semibold text-red-500 dark:text-red-400">No</p>
      </button>
    </div>
  );
}
