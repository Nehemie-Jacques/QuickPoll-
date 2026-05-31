"use client";

import {
  Area,
  AreaChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { PollResults } from "@/types/poll";

export function ActivityChart({
  activity,
}: {
  activity: PollResults["activity"];
  accentColor: string;
}) {
  if (activity.length === 0) {
    return <p className="text-sm text-zinc-500">No activity yet</p>;
  }

  const cumulative = activity.reduce<{ timestamp: string; count: number }[]>(
    (acc, cur) => {
      const prev = acc.length ? acc[acc.length - 1].count : 0;
      acc.push({ timestamp: cur.timestamp, count: prev + cur.count });
      return acc;
    },
    [],
  );

  return (
    <div className="h-52 w-full rounded-xl bg-zinc-900/80 p-2">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={cumulative}>
          <defs>
            <linearGradient id="voteGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7C3AED" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#7C3AED" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="timestamp" tick={{ fill: "#71717a", fontSize: 10 }} />
          <YAxis allowDecimals={false} tick={{ fill: "#71717a", fontSize: 10 }} width={28} />
          <Tooltip
            contentStyle={{
              background: "#18181b",
              border: "1px solid #3f3f46",
              borderRadius: 8,
            }}
          />
          <Area
            type="monotone"
            dataKey="count"
            stroke="#7C3AED"
            fill="url(#voteGrad)"
          />
          <Line type="monotone" dataKey="count" stroke="#A78BFA" strokeWidth={2} dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
