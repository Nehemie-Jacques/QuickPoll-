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
    <div className="flex justify-center gap-3 py-4">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          className="text-5xl transition-transform hover:scale-110"
          style={{ color: value !== null && n <= value ? "#F59E0B" : "#3f3f46" }}
          aria-label={`${n} stars`}
        >
          ★
        </button>
      ))}
    </div>
  );
}
