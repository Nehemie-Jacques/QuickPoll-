"use client";

import { Input } from "@/components/ui/Input";
import { Toggle } from "@/components/ui/Toggle";

export interface AdvancedSettingsState {
  password: string;
  allowComments: boolean;
  showResultsBeforeClose: boolean;
  requireAlias: boolean;
  maxChoices: number;
  notifyEmail: string;
}

interface AdvancedSettingsProps {
  type: string;
  settings: AdvancedSettingsState;
  onChange: (settings: AdvancedSettingsState) => void;
}

export function AdvancedSettings({
  type,
  settings,
  onChange,
}: AdvancedSettingsProps) {
  function patch(partial: Partial<AdvancedSettingsState>) {
    onChange({ ...settings, ...partial });
  }

  return (
    <div className="space-y-4 rounded-xl border border-dashed border-zinc-300 p-4 dark:border-zinc-700">
      <h3 className="text-sm font-semibold">Paramètres avancés</h3>
      <Input
        type="password"
        placeholder="Mot de passe (optionnel)"
        value={settings.password}
        onChange={(e) => patch({ password: e.target.value })}
      />
      <Input
        type="email"
        placeholder="Email — notification au 1er vote"
        value={settings.notifyEmail}
        onChange={(e) => patch({ notifyEmail: e.target.value })}
      />
      {type === "multiple_choice" && (
        <div>
          <label className="text-sm">Limite de choix</label>
          <Input
            type="number"
            min={2}
            max={20}
            value={settings.maxChoices}
            onChange={(e) =>
              patch({ maxChoices: Number(e.target.value) || 2 })
            }
          />
        </div>
      )}
      <Toggle
        label="Autoriser les commentaires"
        checked={settings.allowComments}
        onCheckedChange={(v) => patch({ allowComments: v })}
      />
      <Toggle
        label="Afficher les résultats avant clôture"
        checked={settings.showResultsBeforeClose}
        onCheckedChange={(v) => patch({ showResultsBeforeClose: v })}
      />
      <Toggle
        label="Demander un alias au votant"
        checked={settings.requireAlias}
        onCheckedChange={(v) => patch({ requireAlias: v })}
      />
    </div>
  );
}
