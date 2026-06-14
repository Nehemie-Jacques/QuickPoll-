"use client";

import { useMemo, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { clientVoteUrl } from "@/lib/urls";

interface QRModalProps {
  pollId: string;
  voteUrl?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function QRModal({
  pollId,
  voteUrl: voteUrlProp,
  open,
  onOpenChange,
}: QRModalProps) {
  const [error, setError] = useState(false);
  const voteUrl = useMemo(
    () => voteUrlProp ?? clientVoteUrl(pollId),
    [pollId, voteUrlProp],
  );
  const src = useMemo(
    () => `/api/polls/${pollId}/qr?url=${encodeURIComponent(voteUrl)}`,
    [pollId, voteUrl],
  );

  return (
    <Modal open={open} onOpenChange={onOpenChange} title="Scan to vote">
      <div className="flex min-w-0 flex-col items-center gap-4">
        {!error ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={src}
            src={src}
            alt="QR code for vote link"
            width={240}
            height={240}
            className="max-w-full rounded-xl border border-[var(--border-subtle)] bg-white p-3"
            onError={() => setError(true)}
          />
        ) : (
          <p className="text-center text-sm text-red-400">
            Could not load QR code. Use the vote link below instead.
          </p>
        )}
        <div className="w-full min-w-0 max-w-full overflow-hidden rounded-lg bg-[var(--bg-elevated)] p-3">
          <p className="qp-url-text text-center font-mono text-xs text-[var(--text-secondary)]">
            {voteUrl}
          </p>
        </div>
        <a href={src} download={`quickpoll-${pollId}-qr.png`}>
          <Button type="button" variant="secondary" className="w-full sm:w-auto">
            Download PNG
          </Button>
        </a>
      </div>
    </Modal>
  );
}
