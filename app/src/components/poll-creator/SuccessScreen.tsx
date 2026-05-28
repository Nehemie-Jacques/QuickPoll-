"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useToast } from "@/components/ui/Toast";

interface SuccessScreenProps {
  voteUrl: string;
  manageUrl: string;
  onReset: () => void;
}

export function SuccessScreen({
  voteUrl,
  manageUrl,
  onReset,
}: SuccessScreenProps) {
  const { show } = useToast();

  function copy(text: string, label: string) {
    navigator.clipboard.writeText(text);
    show(`${label} copié`);
  }

  return (
    <Card className="space-y-4 text-center">
      <h2 className="text-xl font-semibold text-emerald-600">
        Sondage créé !
      </h2>
      <p className="text-sm text-zinc-500">
        Partagez le lien de vote. Conservez le lien de gestion — il ne sera plus
        affiché.
      </p>
      <div className="space-y-2 text-left">
        <p className="text-xs font-medium text-zinc-500">Lien public (vote)</p>
        <div className="flex gap-2">
          <code className="flex-1 truncate rounded bg-zinc-100 p-2 text-xs dark:bg-zinc-900">
            {voteUrl}
          </code>
          <Button type="button" variant="secondary" onClick={() => copy(voteUrl, "Lien vote")}>
            Copier
          </Button>
        </div>
        <p className="text-xs font-medium text-zinc-500">Lien privé (gestion)</p>
        <div className="flex gap-2">
          <code className="flex-1 truncate rounded bg-zinc-100 p-2 text-xs dark:bg-zinc-900">
            {manageUrl}
          </code>
          <Button type="button" variant="secondary" onClick={() => copy(manageUrl, "Lien gestion")}>
            Copier
          </Button>
        </div>
      </div>
      <div className="flex justify-center gap-2">
        <Button type="button" onClick={() => window.open(voteUrl, "_blank")}>
          Voir le sondage
        </Button>
        <Button type="button" variant="secondary" onClick={onReset}>
          Nouveau sondage
        </Button>
      </div>
    </Card>
  );
}
