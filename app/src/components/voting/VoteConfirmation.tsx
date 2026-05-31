"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function VoteConfirmation({
  pollId,
  showResults,
  accentColor,
}: {
  pollId: string;
  showResults: boolean;
  accentColor: string;
}) {
  return (
    <motion.div
      initial={{ scale: 0.85, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="py-12 text-center"
    >
      <div
        className="mx-auto mb-4 flex size-20 items-center justify-center rounded-full text-4xl text-white"
        style={{ background: accentColor }}
      >
        ✓
      </div>
      <h2 className="font-display text-2xl font-bold">Thanks for voting!</h2>
      {showResults && (
        <Link href={`/poll/${pollId}/results`} className="mt-6 inline-block">
          <Button variant="cta">View results →</Button>
        </Link>
      )}
    </motion.div>
  );
}
