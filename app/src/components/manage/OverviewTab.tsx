"use client";

import type { Poll, PollResults } from "@/types/poll";
import { StatsRow } from "@/components/results/StatsRow";
import { ResultsBreakdown } from "@/components/results/ResultsBreakdown";
import { ActivityChart } from "@/components/results/ActivityChart";
import { Button } from "@/components/ui/Button";

interface OverviewTabProps {
  poll: Poll;
  results: PollResults;
  token: string;
  onRefresh: () => void;
}

export function OverviewTab({
  poll,
  results,
  token,
  onRefresh,
}: OverviewTabProps) {
  async function closePoll() {
    await fetch(`/api/polls/${poll.id}/manage?token=${token}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "close" }),
    });
    onRefresh();
  }

  return (
    <div className="space-y-6">
      <StatsRow
        totalVotes={results.totalVotes}
        ratingAverage={results.ratingAverage}
      />
      <ResultsBreakdown poll={poll} results={results} />
      <ActivityChart activity={results.activity} accentColor={poll.accentColor} />
      <Button type="button" variant="secondary" onClick={closePoll}>
        Clore le sondage
      </Button>
    </div>
  );
}
