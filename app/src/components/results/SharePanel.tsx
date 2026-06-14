"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { clientVoteUrl } from "@/lib/urls";
import { QRModal } from "./QRModal";

export function SharePanel({
  pollId,
  exportUrl,
}: {
  pollId: string;
  exportUrl?: string;
}) {
  const { show } = useToast();
  const [qrOpen, setQrOpen] = useState(false);
  const [showEmbed, setShowEmbed] = useState(false);

  const voteUrl = useMemo(() => clientVoteUrl(pollId), [pollId]);

  const iframe = `<iframe src="${voteUrl}" width="100%" height="400" frameborder="0"></iframe>`;
  const twitter = `https://twitter.com/intent/tweet?text=${encodeURIComponent(voteUrl)}`;
  const whatsapp = `https://wa.me/?text=${encodeURIComponent(voteUrl)}`;

  function copy(text: string, label: string) {
    navigator.clipboard.writeText(text);
    show(`${label} copied`);
  }

  return (
    <div className="min-w-0 space-y-4">
      <div className="min-w-0 max-w-full overflow-hidden rounded-lg bg-[var(--bg-elevated)] p-3">
        <p className="qp-url-text font-mono text-xs text-[var(--text-secondary)]">{voteUrl}</p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" type="button" onClick={() => copy(voteUrl, "Link")}>
          Copy link
        </Button>
        <a href={twitter} target="_blank" rel="noopener noreferrer">
          <Button variant="ghost" type="button">
            X / Twitter
          </Button>
        </a>
        <a href={whatsapp} target="_blank" rel="noopener noreferrer">
          <Button variant="ghost" type="button">
            WhatsApp
          </Button>
        </a>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button variant="ghost" type="button" onClick={() => setShowEmbed(!showEmbed)}>
          Embed
        </Button>
        <Button variant="ghost" type="button" onClick={() => setQrOpen(true)}>
          QR Code
        </Button>
        {exportUrl && (
          <a href={exportUrl} download>
            <Button variant="ghost" type="button">
              ⬇ Export CSV
            </Button>
          </a>
        )}
      </div>
      {showEmbed && (
        <pre className="qp-url-text max-w-full overflow-x-auto rounded-lg bg-[var(--bg-elevated)] p-3 font-mono text-xs text-[var(--text-secondary)]">
          {iframe}
        </pre>
      )}
      <QRModal pollId={pollId} open={qrOpen} onOpenChange={setQrOpen} />
    </div>
  );
}
