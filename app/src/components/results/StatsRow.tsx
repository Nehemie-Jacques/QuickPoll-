"use client";

import { Card } from "@/components/ui/Card";

interface StatsRowProps {
  totalVotes: number;
  ratingAverage?: number;
}

export function StatsRow({ totalVotes, ratingAverage }: StatsRowProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Card className="text-center">
        <p className="text-3xl font-bold">{totalVotes}</p>
        <p className="text-sm text-zinc-500">Votes</p>
      </Card>
      {ratingAverage !== undefined && (
        <Card className="text-center">
          <p className="text-3xl font-bold">{ratingAverage.toFixed(1)}</p>
          <p className="text-sm text-zinc-500">Moyenne / 5</p>
        </Card>
      )}
    </div>
  );
}
