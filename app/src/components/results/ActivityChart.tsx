"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { PollResults } from "@/types/poll";

interface ActivityChartProps {
  activity: PollResults["activity"];
  accentColor: string;
}

export function ActivityChart({ activity, accentColor }: ActivityChartProps) {
  if (activity.length === 0) {
    return <p className="text-sm text-zinc-500">Pas encore d&apos;activité</p>;
  }

  return (
    <div className="h-48 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={activity}>
          <XAxis dataKey="timestamp" hide />
          <YAxis allowDecimals={false} width={30} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="count"
            stroke={accentColor}
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
