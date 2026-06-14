"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useToast } from "@/components/ui/Toast";
import { QRModal } from "@/components/results/QRModal";
import { resolvePublicVoteUrl } from "@/lib/urls";

export function SuccessScreen({
  pollId,
  voteUrl: serverVoteUrl,
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

  const voteUrl = useMemo(
    () => resolvePublicVoteUrl(pollId, serverVoteUrl),
    [pollId, serverVoteUrl],
  );

  function copy(text: string, label: string) {
    navigator.clipboard.writeText(text);
    show(`${label} copied`);
  }

  const whatsapp = `https://wa.me/?text=${encodeURIComponent(`Vote now: ${voteUrl}`)}`;

  return (
    <Card className="qp-animate-in mx-auto max-w-2xl space-y-6 px-4 py-8 sm:px-8">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-emerald-500/15 ring-1 ring-emerald-500/30"
      >
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M5 13l4 4L19 7"
            stroke="#10b981"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </motion.div>

      <div className="text-center">
        <h2 className="font-display text-2xl font-bold sm:text-3xl">
          Your poll is live
        </h2>
        <p className="mt-2 text-sm text-[var(--text-secondary)]">
          Share the public vote link — keep the creator link private.
        </p>
      </div>

      {/* Public vote link — primary */}
      <div className="rounded-2xl border-2 border-violet-500/50 bg-gradient-to-br from-violet-600/10 to-blue-600/5 p-4 sm:p-5">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <Badge tone="live">Public</Badge>
          <span className="text-xs font-semibold uppercase tracking-wider text-violet-400">
            Vote link — share this
          </span>
        </div>
        <p className="break-all font-mono text-sm leading-relaxed text-[var(--text-primary)]">
          {voteUrl}
        </p>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <Button
            type="button"
            variant="cta"
            className="flex-1"
            onClick={() => copy(voteUrl, "Vote link")}
          >
            Copy vote link
          </Button>
          <Link href={voteUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
            <Button type="button" variant="primary" className="w-full">
              Open poll
            </Button>
          </Link>
        </div>
      </div>

      {/* Private manage link */}
      <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)]/50 p-4 sm:p-5">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <Badge tone="muted">Private</Badge>
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
            Creator link — do not share
          </span>
        </div>
        <p className="break-all font-mono text-xs leading-relaxed text-[var(--text-secondary)]">
          {manageUrl}
        </p>
        <Button
          type="button"
          variant="ghost"
          className="mt-4 w-full sm:w-auto"
          onClick={() => copy(manageUrl, "Creator link")}
        >
          Copy creator link
        </Button>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
        <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="flex-1 sm:flex-none">
          <Button type="button" variant="secondary" className="w-full">
            Share on WhatsApp
          </Button>
        </a>
        <Button
          type="button"
          variant="ghost"
          className="flex-1 sm:flex-none"
          onClick={() => setQrOpen(true)}
        >
          Show QR code
        </Button>
      </div>

      <Button type="button" variant="ghost" className="w-full" onClick={onReset}>
        Create another poll
      </Button>

      <QRModal
        pollId={pollId}
        voteUrl={voteUrl}
        open={qrOpen}
        onOpenChange={setQrOpen}
      />
    </Card>
  );
}
