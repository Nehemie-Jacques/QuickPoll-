"use client";

import type { Poll, PollResults } from "@/types/poll";
import { OptionBar } from "./OptionBar";

export function ResultsBreakdown({
  poll,
  results,
}: {
  poll: Poll;
  results: PollResults;
}) {
  const total = results.totalVotes;

  let entries: { key: string; label: string; count: number }[] = [];

  if (poll.type === "yes_no") {
    entries = [
      { key: "yes", label: "Yes", count: results.breakdown.yes ?? 0 },
      { key: "no", label: "No", count: results.breakdown.no ?? 0 },
    ];
  } else if (poll.type === "rating") {
    entries = [5, 4, 3, 2, 1].map((n) => ({
      key: `rating-${n}`,
      label: `${n} ★`,
      count: results.breakdown[`rating-${n}`] ?? 0,
    }));
  } else {
    entries = poll.options.map((o) => ({
      key: o.id,
      label: o.label,
      count: results.breakdown[o.id] ?? 0,
    }));
  }

  const max = Math.max(...entries.map((e) => e.count), 0);

  return (
    <div className="space-y-4">
      {results.ratingAverage !== undefined && (
        <p className="text-lg font-semibold text-zinc-200">
          Average: {results.ratingAverage.toFixed(1)} / 5
        </p>
      )}
      {entries.map((e) => (
        <OptionBar
          key={e.key}
          label={e.label}
          count={e.count}
          total={total}
          isLeader={e.count > 0 && e.count === max}
        />
      ))}
    </div>
  );
}
