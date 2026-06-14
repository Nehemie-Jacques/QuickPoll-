"use client";

import { useState } from "react";
import type { CreatePollInput, ExpirationPreset, PollType } from "@/types/poll";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input, Textarea } from "@/components/ui/Input";
import { PollTypeSelector } from "./PollTypeSelector";
import { OptionsList } from "./OptionsList";
import { ExpirationPicker } from "./ExpirationPicker";
import {
  AdvancedSettings,
  type AdvancedSettingsState,
} from "./AdvancedSettings";
import { SuccessScreen } from "./SuccessScreen";
import { PageContainer } from "@/components/layout/PageContainer";

const ACCENTS = ["#7C3AED", "#2563EB", "#EC4899", "#14B8A6", "#F97316"];

const defaultAdvanced: AdvancedSettingsState = {
  password: "",
  passwordEnabled: false,
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
  const [accentColor, setAccentColor] = useState(ACCENTS[0]);
  const [expiration, setExpiration] = useState<ExpirationPreset>("24h");
  const [customExpiresAt, setCustomExpiresAt] = useState("");
  const [advanced, setAdvanced] = useState(defaultAdvanced);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<{
    pollId: string;
    voteUrl: string;
    manageUrl: string;
  } | null>(null);

  const showOptions = type === "single_choice" || type === "multiple_choice";
  const fixedOptions = type === "yes_no";

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
          ? [{ label: "Yes" }, { label: "No" }]
          : [
              { label: "1" },
              { label: "2" },
              { label: "3" },
              { label: "4" },
              { label: "5" },
            ],
      accentColor,
      expiration,
      customExpiresAt:
        expiration === "custom" && customExpiresAt
          ? new Date(customExpiresAt).toISOString()
          : undefined,
      notifyEmail: advanced.notifyEmail || undefined,
      settings: {
        password:
          advanced.passwordEnabled && advanced.password
            ? advanced.password
            : undefined,
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
      setSuccess({
        pollId: data.pollId,
        voteUrl: data.voteUrl,
        manageUrl: data.manageUrl,
      });
    } catch {
      alert("Could not create poll");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <PageContainer size="md">
        <SuccessScreen
          pollId={success.pollId}
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
      </PageContainer>
    );
  }

  return (
    <PageContainer size="md">
      <section className="mb-8 text-center sm:mb-10">
        <Badge tone="violet" className="mb-4">
          No account required
        </Badge>
        <h1 className="font-display text-[clamp(1.75rem,5vw,3rem)] font-bold leading-[1.1] tracking-tight">
          Create a poll{" "}
          <span className="qp-gradient-text">in seconds</span>
        </h1>
        <p className="mx-auto mt-4 max-w-md text-base text-[var(--text-secondary)]">
          Share the link. Get instant results. No sign-up needed.
        </p>
      </section>

      <form onSubmit={handleSubmit} className="min-w-0">
        <Card className="min-w-0 space-y-8">
          <div>
            <p className="mb-3 text-xs font-medium uppercase tracking-wider text-[var(--text-label)]">
              Poll type
            </p>
            <PollTypeSelector value={type} onChange={setType} />
          </div>

          <div className="space-y-4">
            <Input
              placeholder="Your question or poll title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="text-lg font-medium"
            />
            <Textarea
              placeholder="Add a description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
            />
            <OptionsList
              options={options}
              onChange={setOptions}
              showOptions={showOptions}
              fixed={fixedOptions}
            />
          </div>

          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-[var(--text-label)]">
              Accent color
            </p>
            <div className="flex gap-2">
              {ACCENTS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setAccentColor(c)}
                  className={`qp-ring-offset size-8 rounded-full ring-2 ring-offset-2 ${
                    accentColor === c ? "ring-violet-500" : "ring-transparent"
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

          <AdvancedSettings
            type={type}
            settings={advanced}
            onChange={setAdvanced}
          />

          <div>
            <Button
              type="submit"
              variant="cta"
              className="w-full text-base"
              disabled={loading}
            >
              {loading ? "Creating…" : "Create Poll →"}
            </Button>
            <p className="mt-3 text-center text-xs text-[var(--text-muted)]">
              Your poll creator link will appear after creation.
            </p>
          </div>
        </Card>
      </form>
    </PageContainer>
  );
}
