"use client";

import type { Poll, PollResults } from "@/types/poll";
import { OptionBar } from "./OptionBar";

interface ResultsBreakdownProps {
  poll: Poll;
  results: PollResults;
}

export function ResultsBreakdown({ poll, results }: ResultsBreakdownProps) {
  const total = results.totalVotes;

  if (poll.type === "yes_no") {
    return (
      <div className="space-y-3">
        <OptionBar label="Oui" count={results.breakdown.yes ?? 0} total={total} accentColor={poll.accentColor} />
        <OptionBar label="Non" count={results.breakdown.no ?? 0} total={total} accentColor={poll.accentColor} />
      </div>
    );
  }

  if (poll.type === "rating") {
    return (
      <div className="space-y-3">
        {results.ratingAverage !== undefined && (
          <p className="text-lg font-semibold">
            Moyenne : {results.ratingAverage.toFixed(1)} / 5
          </p>
        )}
        {[5, 4, 3, 2, 1].map((n) => (
          <OptionBar
            key={n}
            label={`${n} ★`}
            count={results.breakdown[`rating-${n}`] ?? 0}
            total={total}
            accentColor={poll.accentColor}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {poll.options.map((opt) => (
        <OptionBar
          key={opt.id}
          label={opt.label}
          count={results.breakdown[opt.id] ?? 0}
          total={total}
          accentColor={poll.accentColor}
        />
      ))}
    </div>
  );
}
