"use client";

interface RatingScaleProps {
  value: number | null;
  accentColor: string;
  onChange: (rating: number) => void;
}

export function RatingScale({ value, accentColor, onChange }: RatingScaleProps) {
  return (
    <div className="flex justify-center gap-2">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          className="text-4xl transition-transform hover:scale-110"
          style={{ color: value !== null && n <= value ? accentColor : "#d4d4d8" }}
          aria-label={`${n} étoiles`}
        >
          ★
        </button>
      ))}
    </div>
  );
}
