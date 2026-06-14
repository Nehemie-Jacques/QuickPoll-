"use client";

export function RatingScale({
  value,
  onChange,
}: {
  value: number | null;
  accentColor: string;
  onChange: (n: number) => void;
}) {
  return (
    <div className="flex min-w-0 w-full justify-center gap-1 py-4 sm:gap-3">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          className="text-[clamp(1.75rem,9vw,3rem)] leading-none transition-opacity hover:opacity-90"
          style={{ color: value !== null && n <= value ? "#F59E0B" : "var(--border-subtle)" }}
          aria-label={`${n} stars`}
        >
          ★
        </button>
      ))}
    </div>
  );
}
