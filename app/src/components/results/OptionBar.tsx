"use client";

import { motion } from "framer-motion";

interface OptionBarProps {
  label: string;
  count: number;
  total: number;
  accentColor: string;
}

export function OptionBar({ label, count, total, accentColor }: OptionBarProps) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;

  return (
    <div>
      <div className="mb-1 flex justify-between text-sm">
        <span>{label}</span>
        <span className="text-zinc-500">
          {count} ({pct}%)
        </span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: accentColor }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </div>
  );
}
