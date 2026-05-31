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
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <span className="flex items-center gap-2 text-sm font-medium text-zinc-200">
          {label}
          {isLeader && <Badge tone="gold">👑 Leading</Badge>}
        </span>
        <span className="text-sm text-zinc-500">
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
