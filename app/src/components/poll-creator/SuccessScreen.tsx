"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ShareLinkBox } from "@/components/ui/ShareLinkBox";
import { useToast } from "@/components/ui/Toast";
import { QRModal } from "@/components/results/QRModal";
import { clientVoteUrl } from "@/lib/urls";

export function SuccessScreen({
  pollId,
  voteUrl: _serverVoteUrl,
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

  const voteUrl = useMemo(() => clientVoteUrl(pollId), [pollId]);

  function copy(text: string, label: string) {
    navigator.clipboard.writeText(text);
    show(`${label} copied`);
  }

  const whatsapp = `https://wa.me/?text=${encodeURIComponent(`Vote now: ${voteUrl}`)}`;

  return (
    <Card className="qp-animate-in min-w-0 space-y-6 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
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

      <ShareLinkBox
        badge="Public"
        badgeTone="live"
        label="Vote link — share this"
        url={voteUrl}
        variant="public"
        actions={
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              type="button"
              variant="cta"
              className="w-full min-w-0 sm:flex-1"
              onClick={() => copy(voteUrl, "Vote link")}
            >
              Copy vote link
            </Button>
            <Link
              href={voteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full min-w-0 sm:flex-1"
            >
              <Button type="button" variant="primary" className="w-full">
                Open poll
              </Button>
            </Link>
          </div>
        }
      />

      <ShareLinkBox
        badge="Private"
        badgeTone="muted"
        label="Creator link — do not share"
        url={manageUrl}
        variant="private"
        actions={
          <Button
            type="button"
            variant="ghost"
            className="w-full min-w-0 sm:w-auto"
            onClick={() => copy(manageUrl, "Creator link")}
          >
            Copy creator link
          </Button>
        }
      />

      <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:justify-center">
        <a
          href={whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="min-w-0 flex-1 sm:flex-none"
        >
          <Button type="button" variant="secondary" className="w-full">
            Share on WhatsApp
          </Button>
        </a>
        <Button
          type="button"
          variant="ghost"
          className="min-w-0 flex-1 sm:flex-none"
          onClick={() => setQrOpen(true)}
        >
          Show QR code
        </Button>
      </div>

      <Button type="button" variant="ghost" className="w-full" onClick={onReset}>
        Create another poll
      </Button>

      <QRModal pollId={pollId} open={qrOpen} onOpenChange={setQrOpen} />
    </Card>
  );
}
