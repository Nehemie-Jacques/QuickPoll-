"use client";

import { useState } from "react";
import type { Poll, PollResults } from "@/types/poll";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ResultsBreakdown } from "@/components/results/ResultsBreakdown";
import { ActivityChart } from "@/components/results/ActivityChart";

export function OverviewTab({
  poll,
  results,
  token,
  onRefresh,
}: {
  poll: Poll;
  results: PollResults;
  token: string;
  onRefresh: () => void;
}) {
  const [timeActive] = useState(() =>
    Math.max(1, Math.round((Date.now() - new Date(poll.createdAt).getTime()) / 3_600_000))
  );

  const headers = {
    "Content-Type": "application/json",
    "x-manage-token": token,
  };

  async function action(body: object) {
    await fetch(`/api/polls/${poll.id}/manage?token=${encodeURIComponent(token)}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(body),
    });
    onRefresh();
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total votes", value: results.totalVotes },
          { label: "Unique voters", value: results.totalVotes },
          { label: "Comments", value: results.comments.length },
          {
            label: "Time active",
            value: `${timeActive}h`,
          },
        ].map((s) => (
          <Card key={s.label} className="p-4 text-center">
            <p className="font-display text-2xl font-bold">{s.value}</p>
            <p className="text-xs uppercase tracking-wider text-zinc-500">
              {s.label}
            </p>
          </Card>
        ))}
      </div>

      <Card className="space-y-4">
        <h3 className="font-display font-semibold">Results snapshot</h3>
        <ResultsBreakdown poll={poll} results={results} />
        <ActivityChart activity={results.activity} accentColor={poll.accentColor} />
      </Card>

      <div className="flex flex-wrap gap-2">
        <Button variant="ghost" type="button" onClick={() => action({ action: "close" })}>
          Close poll
        </Button>
        <Button
          variant="ghost"
          type="button"
          onClick={() => {
            const d = new Date();
            d.setDate(d.getDate() + 1);
            action({ action: "extend", expiresAt: d.toISOString() });
          }}
        >
          Extend +24h
        </Button>
        <Button variant="ghost" type="button" onClick={() => action({ action: "duplicate" })}>
          Duplicate poll
        </Button>
      </div>
    </div>
  );
}
