"use client";

import { useState } from "react";
import type { Poll } from "@/types/poll";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SingleChoice } from "./SingleChoice";
import { MultipleChoice } from "./MultipleChoice";
import { RatingScale } from "./RatingScale";
import { YesNo } from "./YesNo";
import { CommentInput } from "./CommentInput";
import { AliasInput } from "./AliasInput";
import { PasswordGate } from "./PasswordGate";
import { VoteConfirmation } from "./VoteConfirmation";

interface VoteFormProps {
  poll: Poll & { settings: Poll["settings"] & { hasPassword?: boolean } };
}

export function VoteForm({ poll }: VoteFormProps) {
  const [password, setPassword] = useState<string | null>(
    poll.settings.hasPassword ? null : "",
  );
  const [optionIds, setOptionIds] = useState<string[]>([]);
  const [singleId, setSingleId] = useState<string | null>(null);
  const [rating, setRating] = useState<number | null>(null);
  const [yesNo, setYesNo] = useState<boolean | null>(null);
  const [alias, setAlias] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (poll.settings.hasPassword && password === null) {
    return <PasswordGate onUnlock={setPassword} />;
  }

  if (done) {
    return (
      <VoteConfirmation
        pollId={poll.id}
        showResults={poll.settings.showResultsBeforeClose}
        accentColor={poll.accentColor}
      />
    );
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const body: Record<string, unknown> = {
      password: password || undefined,
      alias: alias || undefined,
      comment: comment || undefined,
    };

    if (poll.type === "single_choice") body.optionIds = singleId ? [singleId] : [];
    if (poll.type === "multiple_choice") body.optionIds = optionIds;
    if (poll.type === "rating") body.rating = rating;
    if (poll.type === "yes_no") body.yesNo = yesNo;

    try {
      const res = await fetch(`/api/polls/${poll.id}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Erreur");
        return;
      }
      setDone(true);
    } catch {
      setError("Erreur réseau");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="mx-auto max-w-lg space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: poll.accentColor }}>
          {poll.title}
        </h1>
        {poll.description && (
          <p className="mt-2 text-zinc-500">{poll.description}</p>
        )}
      </div>

      <form onSubmit={submit} className="space-y-4">
        {poll.type === "single_choice" && (
          <SingleChoice
            options={poll.options}
            value={singleId}
            accentColor={poll.accentColor}
            onChange={setSingleId}
          />
        )}
        {poll.type === "multiple_choice" && (
          <MultipleChoice
            options={poll.options}
            value={optionIds}
            maxChoices={poll.settings.maxChoices ?? 3}
            accentColor={poll.accentColor}
            onChange={setOptionIds}
          />
        )}
        {poll.type === "rating" && (
          <RatingScale
            value={rating}
            accentColor={poll.accentColor}
            onChange={setRating}
          />
        )}
        {poll.type === "yes_no" && (
          <YesNo
            value={yesNo}
            accentColor={poll.accentColor}
            onChange={setYesNo}
          />
        )}

        {poll.settings.requireAlias && (
          <AliasInput
            value={alias}
            required
            onChange={setAlias}
          />
        )}
        {!poll.settings.requireAlias && (
          <AliasInput value={alias} onChange={setAlias} />
        )}
        {poll.settings.allowComments && (
          <CommentInput value={comment} onChange={setComment} />
        )}

        {error && <p className="text-sm text-red-600">{error}</p>}

        <Button
          type="submit"
          className="w-full"
          disabled={loading}
          style={{ backgroundColor: poll.accentColor }}
        >
          {loading ? "Envoi…" : "Voter"}
        </Button>
      </form>
    </Card>
  );
}
