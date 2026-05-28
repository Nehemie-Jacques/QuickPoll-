"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Toggle } from "@/components/ui/Toggle";

interface DangerZoneProps {
  pollId: string;
  token: string;
  showResults: boolean;
  onRefresh: () => void;
}

export function DangerZone({
  pollId,
  token,
  showResults,
  onRefresh,
}: DangerZoneProps) {
  const router = useRouter();

  async function patch(body: object) {
    await fetch(`/api/polls/${pollId}/manage?token=${token}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    onRefresh();
  }

  async function remove() {
    if (!confirm("Supprimer définitivement ce sondage ?")) return;
    await fetch(`/api/polls/${pollId}/manage?token=${token}`, {
      method: "DELETE",
    });
    router.push("/");
  }

  return (
    <Card className="space-y-4 border-red-200 dark:border-red-900">
      <h3 className="font-semibold text-red-600">Zone de danger</h3>
      <Toggle
        label="Afficher les résultats avant clôture"
        checked={showResults}
        onCheckedChange={(v) =>
          patch({ action: "toggle_results", showResultsBeforeClose: v })
        }
      />
      <Button
        type="button"
        variant="secondary"
        onClick={() => patch({ action: "duplicate" })}
      >
        Dupliquer le sondage
      </Button>
      <Button type="button" variant="danger" onClick={remove}>
        Supprimer le sondage
      </Button>
    </Card>
  );
}
