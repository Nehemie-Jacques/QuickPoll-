"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useToast } from "@/components/ui/Toast";
import { QRModal } from "@/components/results/QRModal";

export function SuccessScreen({
  pollId,
  voteUrl,
  manageUrl,
  onReset,
}: {
  pollId: string;
  voteUrl: string;
  manageUrl: string;
  onReset: () => void;
}) {
  const { show } = useToast();
  const [qrOpen, setQrOpen] = useState(false);

  function copy(text: string, label: string) {
    navigator.clipboard.writeText(text);
    show(`${label} copied`);
  }

  const whatsapp = `https://wa.me/?text=${encodeURIComponent(`Vote now: ${voteUrl}`)}`;

  return (
    <Card className="qp-animate-in mx-auto max-w-2xl space-y-6 text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-500/20 text-3xl text-emerald-400"
      >
        ✓
      </motion.div>
      <h2 className="font-display text-2xl font-bold">Your poll is ready! 🎉</h2>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-violet-500/40 bg-violet-600/10 p-4 text-left">
          <p className="text-xs font-medium uppercase tracking-wider text-violet-300">
            Vote link
          </p>
          <p className="font-mono mt-2 truncate text-xs text-zinc-300">{voteUrl}</p>
          <Button
            type="button"
            variant="ghost"
            className="mt-3 w-full py-2 text-xs"
            onClick={() => copy(voteUrl, "Vote link")}
          >
            📋 Copy
          </Button>
        </div>
        <div className="rounded-xl border border-zinc-700 bg-zinc-800/80 p-4 text-left">
          <p className="flex items-center gap-1 text-xs font-medium uppercase tracking-wider text-zinc-400">
            🔒 Creator link (keep private)
          </p>
          <p className="font-mono mt-2 truncate text-xs text-zinc-400">{manageUrl}</p>
          <Button
            type="button"
            variant="ghost"
            className="mt-3 w-full py-2 text-xs"
            onClick={() => copy(manageUrl, "Creator link")}
          >
            📋 Copy
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
        <a href={whatsapp} target="_blank" rel="noopener noreferrer">
          <Button type="button" variant="cta" className="w-full sm:w-auto">
            Share on WhatsApp
          </Button>
        </a>
        <Button
          type="button"
          variant="ghost"
          onClick={() => copy(voteUrl, "Vote link")}
        >
          Copy vote link
        </Button>
      </div>

      <button
        type="button"
        onClick={() => setQrOpen(true)}
        className="text-sm text-violet-400 hover:underline"
      >
        Show QR code
      </button>

      <Button type="button" variant="secondary" onClick={onReset}>
        Create another poll
      </Button>

      <QRModal pollId={pollId} open={qrOpen} onOpenChange={setQrOpen} />
    </Card>
  );
}
