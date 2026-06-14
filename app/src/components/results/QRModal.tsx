"use client";

import { useMemo, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

interface QRModalProps {
  pollId: string;
  voteUrl: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function QRModal({
  pollId,
  voteUrl,
  open,
  onOpenChange,
}: QRModalProps) {
  const [error, setError] = useState(false);
  const src = useMemo(
    () => `/api/polls/${pollId}/qr?url=${encodeURIComponent(voteUrl)}`,
    [pollId, voteUrl, open],
  );

  return (
    <Modal open={open} onOpenChange={onOpenChange} title="Scan to vote">
      <div className="flex flex-col items-center gap-4">
        {!error ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={src}
            src={src}
            alt="QR code for vote link"
            width={280}
            height={280}
            className="rounded-xl border border-[var(--border-subtle)] bg-white p-3"
            onError={() => setError(true)}
          />
        ) : (
          <p className="text-center text-sm text-red-400">
            Could not load QR code. Use the vote link below instead.
          </p>
        )}
        <p className="max-w-full break-all text-center font-mono text-xs text-[var(--text-secondary)]">
          {voteUrl}
        </p>
        <a href={src} download={`quickpoll-${pollId}-qr.png`}>
          <Button type="button" variant="secondary" className="w-full sm:w-auto">
            Download PNG
          </Button>
        </a>
      </div>
    </Modal>
  );
}
