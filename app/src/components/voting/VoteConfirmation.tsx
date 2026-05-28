"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

interface VoteConfirmationProps {
  pollId: string;
  showResults: boolean;
  accentColor: string;
}

export function VoteConfirmation({
  pollId,
  showResults,
  accentColor,
}: VoteConfirmationProps) {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="text-center"
    >
      <div
        className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full text-3xl text-white"
        style={{ backgroundColor: accentColor }}
      >
        ✓
      </div>
      <h2 className="text-xl font-semibold">Merci pour votre vote !</h2>
      {showResults && (
        <Link href={`/poll/${pollId}/results`} className="mt-4 inline-block">
          <Button type="button">Voir les résultats</Button>
        </Link>
      )}
    </motion.div>
  );
}
