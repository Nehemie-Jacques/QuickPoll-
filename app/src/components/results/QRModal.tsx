"use client";

import { Modal } from "@/components/ui/Modal";
import Image from "next/image";

interface QRModalProps {
  pollId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function QRModal({ pollId, open, onOpenChange }: QRModalProps) {
  return (
    <Modal open={open} onOpenChange={onOpenChange} title="QR Code">
      <div className="flex justify-center">
        <Image
          src={`/api/polls/${pollId}/qr`}
          alt="QR code"
          width={256}
          height={256}
          unoptimized
        />
      </div>
    </Modal>
  );
}
