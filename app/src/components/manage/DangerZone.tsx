"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Toggle } from "@/components/ui/Toggle";
import { Modal } from "@/components/ui/Modal";

export function DangerZone({
  pollId,
  pollTitle,
  token,
  showResults,
  onRefresh,
}: {
  pollId: string;
  pollTitle: string;
  token: string;
  showResults: boolean;
  onRefresh: () => void;
}) {
  const router = useRouter();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");

  async function patch(body: object) {
    await fetch(`/api/polls/${pollId}/manage?token=${encodeURIComponent(token)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-manage-token": token },
      body: JSON.stringify(body),
    });
    onRefresh();
  }

  async function remove() {
    await fetch(`/api/polls/${pollId}/manage?token=${encodeURIComponent(token)}`, {
      method: "DELETE",
      headers: { "x-manage-token": token },
    });
    router.push("/");
  }

  return (
    <Card className="border-red-900/50">
      <h3 className="font-display text-lg font-semibold text-red-400">
        Danger Zone
      </h3>
      <div className="mt-4 space-y-4">
        <Toggle
          label="Show results before poll closes"
          checked={showResults}
          onCheckedChange={(v) =>
            patch({ action: "toggle_results", showResultsBeforeClose: v })
          }
        />
        <Button variant="ghost" type="button" onClick={() => patch({ action: "duplicate" })}>
          Duplicate poll
        </Button>
        <Button variant="danger" type="button" onClick={() => setConfirmOpen(true)}>
          Delete this poll permanently
        </Button>
      </div>

      <Modal
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Confirm deletion"
      >
        <p className="text-sm text-[var(--text-secondary)]">
          Type <strong className="text-[var(--text-primary)]">{pollTitle}</strong> to confirm.
        </p>
        <Input
          className="mt-4"
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
          placeholder={pollTitle}
        />
        <Button
          variant="danger"
          className="mt-4 w-full"
          disabled={confirmText !== pollTitle}
          onClick={remove}
        >
          Delete forever
        </Button>
      </Modal>
    </Card>
  );
}
