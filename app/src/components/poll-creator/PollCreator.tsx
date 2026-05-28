"use client";

import { useState } from "react";
import type { CreatePollInput, ExpirationPreset, PollType } from "@/types/poll";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { PollTypeSelector } from "./PollTypeSelector";
import { OptionsList } from "./OptionsList";
import { ExpirationPicker } from "./ExpirationPicker";
import {
  AdvancedSettings,
  type AdvancedSettingsState,
} from "./AdvancedSettings";
import { SuccessScreen } from "./SuccessScreen";

const ACCENT_COLORS = ["#6366f1", "#ec4899", "#14b8a6", "#f59e0b", "#ef4444"];

const defaultAdvanced: AdvancedSettingsState = {
  password: "",
  allowComments: false,
  showResultsBeforeClose: true,
  requireAlias: false,
  maxChoices: 3,
  notifyEmail: "",
};

export function PollCreator() {
  const [type, setType] = useState<PollType>("single_choice");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [accentColor, setAccentColor] = useState(ACCENT_COLORS[0]);
  const [expiration, setExpiration] = useState<ExpirationPreset>("24h");
  const [customExpiresAt, setCustomExpiresAt] = useState("");
  const [advanced, setAdvanced] = useState(defaultAdvanced);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<{
    voteUrl: string;
    manageUrl: string;
  } | null>(null);

  const showOptions = type === "single_choice" || type === "multiple_choice";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const body: CreatePollInput = {
      title,
      description: description || undefined,
      type,
      options: showOptions
        ? options.filter(Boolean).map((label) => ({ label }))
        : type === "yes_no"
          ? [{ label: "Oui" }, { label: "Non" }]
          : [{ label: "1" }, { label: "2" }, { label: "3" }, { label: "4" }, { label: "5" }],
      accentColor,
      expiration,
      customExpiresAt:
        expiration === "custom" && customExpiresAt
          ? new Date(customExpiresAt).toISOString()
          : undefined,
      notifyEmail: advanced.notifyEmail || undefined,
      settings: {
        password: advanced.password || undefined,
        allowComments: advanced.allowComments,
        showResultsBeforeClose: advanced.showResultsBeforeClose,
        requireAlias: advanced.requireAlias,
        maxChoices: type === "multiple_choice" ? advanced.maxChoices : undefined,
      },
    };

    try {
      const res = await fetch("/api/polls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSuccess({ voteUrl: data.voteUrl, manageUrl: data.manageUrl });
    } catch {
      alert("Erreur lors de la création");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <SuccessScreen
        voteUrl={success.voteUrl}
        manageUrl={success.manageUrl}
        onReset={() => {
          setSuccess(null);
          setTitle("");
          setDescription("");
          setOptions(["", ""]);
          setAdvanced(defaultAdvanced);
        }}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-2xl space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">QuickPoll</h1>
        <p className="mt-2 text-zinc-500">Créez un sondage en quelques secondes</p>
      </div>

      <Card className="space-y-6">
        <Input
          placeholder="Titre du sondage"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <Input
          placeholder="Description (optionnelle)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <PollTypeSelector value={type} onChange={setType} />
        <OptionsList
          options={options}
          onChange={setOptions}
          showOptions={showOptions}
        />

        <div>
          <label className="text-sm font-medium">Couleur d&apos;accent</label>
          <div className="mt-2 flex gap-2">
            {ACCENT_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setAccentColor(c)}
                className={`size-8 rounded-full ring-2 ring-offset-2 ${
                  accentColor === c ? "ring-indigo-600" : "ring-transparent"
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>

        <ExpirationPicker
          expiration={expiration}
          customExpiresAt={customExpiresAt}
          onExpirationChange={setExpiration}
          onCustomChange={setCustomExpiresAt}
        />

        <AdvancedSettings type={type} settings={advanced} onChange={setAdvanced} />

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Création…" : "Créer le sondage"}
        </Button>
      </Card>
    </form>
  );
}
