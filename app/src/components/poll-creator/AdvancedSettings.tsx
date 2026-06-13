"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Toggle } from "@/components/ui/Toggle";

export interface AdvancedSettingsState {
  password: string;
  passwordEnabled: boolean;
  allowComments: boolean;
  showResultsBeforeClose: boolean;
  requireAlias: boolean;
  maxChoices: number;
  notifyEmail: string;
}

export function AdvancedSettings({
  type,
  settings,
  onChange,
}: {
  type: string;
  settings: AdvancedSettingsState;
  onChange: (s: AdvancedSettingsState) => void;
}) {
  const [open, setOpen] = useState(false);

  function patch(p: Partial<AdvancedSettingsState>) {
    onChange({ ...settings, ...p });
  }

  return (
    <div className="border-t border-[var(--border-subtle)] pt-4">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between text-sm font-medium text-[var(--text-secondary)]"
      >
        Advanced settings
        <span className="text-[var(--text-muted)]">{open ? "▲" : "▼"}</span>
      </button>
      {open && (
        <div className="mt-4 space-y-1">
          <ExpirationExtras type={type} settings={settings} patch={patch} />
          <Toggle
            label="Show results before poll closes"
            checked={settings.showResultsBeforeClose}
            onCheckedChange={(v) => patch({ showResultsBeforeClose: v })}
          />
          <Toggle
            label="Allow vote comments"
            checked={settings.allowComments}
            onCheckedChange={(v) => patch({ allowComments: v })}
          />
          <Toggle
            label="Require voter alias"
            checked={settings.requireAlias}
            onCheckedChange={(v) => patch({ requireAlias: v })}
          />
          <Toggle
            label="Protect with password"
            checked={settings.passwordEnabled}
            onCheckedChange={(v) => patch({ passwordEnabled: v, password: v ? settings.password : "" })}
          />
          {settings.passwordEnabled && (
            <Input
              type="password"
              placeholder="Poll password"
              value={settings.password}
              onChange={(e) => patch({ password: e.target.value })}
            />
          )}
          <div className="pt-2">
            <Input
              type="email"
              placeholder="Notify me on first vote (optional)"
              value={settings.notifyEmail}
              onChange={(e) => patch({ notifyEmail: e.target.value })}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function ExpirationExtras({
  type,
  settings,
  patch,
}: {
  type: string;
  settings: AdvancedSettingsState;
  patch: (p: Partial<AdvancedSettingsState>) => void;
}) {
  if (type !== "multiple_choice") return null;
  return (
    <div className="pb-2">
      <label className="text-xs text-[var(--text-secondary)]">Max choices</label>
      <Input
        type="number"
        min={2}
        max={10}
        value={settings.maxChoices}
        onChange={(e) => patch({ maxChoices: Number(e.target.value) || 2 })}
        className="mt-1"
      />
    </div>
  );
}
