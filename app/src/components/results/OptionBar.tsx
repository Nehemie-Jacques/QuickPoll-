"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/Badge";

export function OptionBar({
  label,
  count,
  total,
  isLeader,
}: {
  label: string;
  count: number;
  total: number;
  isLeader?: boolean;
}) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;

  return (
    <div className={isLeader ? "rounded-lg border-l-4 border-amber-500/80 pl-3" : ""}>
      <div className="mb-1.5 flex min-w-0 items-center justify-between gap-2">
        <span className="flex min-w-0 items-center gap-2 text-sm font-medium text-[var(--text-primary)]">
          <span className="truncate">{label}</span>
          {isLeader && <Badge tone="gold" className="shrink-0">👑 Leading</Badge>}
        </span>
        <span className="shrink-0 text-sm text-[var(--text-secondary)]">
          {count} · {pct}%
        </span>
      </div>
      <div className="qp-progress-track">
        <motion.div
          className="qp-progress-fill"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
