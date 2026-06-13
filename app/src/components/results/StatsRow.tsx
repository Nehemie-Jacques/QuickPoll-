"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { formatTimeRemaining } from "@/lib/time-remaining";
import type { Poll } from "@/types/poll";
import type { PollResults } from "@/types/poll";

export function StatsRow({
  poll,
  results,
  leadingLabel,
}: {
  poll: Poll;
  results: PollResults;
  leadingLabel?: string;
}) {
  const time = formatTimeRemaining(poll.expiresAt);

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <StatCard
        icon="🗳"
        label="Total votes"
        value={String(results.totalVotes)}
      />
      <StatCard icon="🕐" label="Time" value={time ?? "No limit"} />
      <StatCard
        icon="🏆"
        label="Leading"
        value={leadingLabel ?? "—"}
        small
      />
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  small,
}: {
  icon: string;
  label: string;
  value: string;
  small?: boolean;
}) {
  return (
    <Card className="p-4 text-center">
      <span className="text-xl">{icon}</span>
      <motion.p
        key={value}
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        className={`mt-2 font-display font-bold text-[var(--text-primary)] ${small ? "truncate text-sm" : "text-2xl"}`}
      >
        {value}
      </motion.p>
      <p className="mt-1 text-xs uppercase tracking-wider text-[var(--text-muted)]">
        {label}
      </p>
    </Card>
  );
}
