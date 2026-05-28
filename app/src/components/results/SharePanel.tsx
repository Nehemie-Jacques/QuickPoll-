"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { QRModal } from "./QRModal";

interface SharePanelProps {
  pollId: string;
  voteUrl: string;
}

export function SharePanel({ pollId, voteUrl }: SharePanelProps) {
  const { show } = useToast();
  const [qrOpen, setQrOpen] = useState(false);

  const iframe = `<iframe src="${voteUrl}" width="100%" height="400" frameborder="0"></iframe>`;
  const twitter = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Votez : ${voteUrl}`)}`;
  const whatsapp = `https://wa.me/?text=${encodeURIComponent(voteUrl)}`;

  function copy(text: string, label: string) {
    navigator.clipboard.writeText(text);
    show(`${label} copié`);
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="secondary" onClick={() => copy(voteUrl, "Lien")}>
          Copier le lien
        </Button>
        <Button type="button" variant="secondary" onClick={() => setQrOpen(true)}>
          QR Code
        </Button>
        <Button type="button" variant="secondary" onClick={() => copy(iframe, "Iframe")}>
          Code iframe
        </Button>
        <a href={twitter} target="_blank" rel="noopener noreferrer">
          <Button type="button" variant="ghost">
            X / Twitter
          </Button>
        </a>
        <a href={whatsapp} target="_blank" rel="noopener noreferrer">
          <Button type="button" variant="ghost">
            WhatsApp
          </Button>
        </a>
      </div>
      <QRModal pollId={pollId} open={qrOpen} onOpenChange={setQrOpen} />
    </div>
  );
}
