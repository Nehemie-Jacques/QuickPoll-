"use client";

import { useEffect, useState } from "react";
import type { Poll, PollType } from "@/types/poll";
import { POLL_TYPE_LABELS } from "@/lib/poll-labels";
import { formatTimeRemaining, isUrgent } from "@/lib/time-remaining";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input, Textarea } from "@/components/ui/Input";
import { SingleChoice } from "./SingleChoice";
import { MultipleChoice } from "./MultipleChoice";
import { RatingScale } from "./RatingScale";
import { YesNo } from "./YesNo";
import { PasswordGate } from "./PasswordGate";
import { VoteConfirmation } from "./VoteConfirmation";
import Link from "next/link";

export type VotePoll = Omit<Poll, "settings"> & {
  settings: Poll["settings"] & { hasPassword?: boolean };
};

export function VoteForm({ poll: initialPoll }: { poll: VotePoll }) {
  const [poll, setPoll] = useState(initialPoll);
  const [unlocked, setUnlocked] = useState(!initialPoll.settings.hasPassword);
  const [password, setPassword] = useState("");
  const [optionIds, setOptionIds] = useState<string[]>([]);
  const [singleId, setSingleId] = useState<string | null>(null);
  const [rating, setRating] = useState<number | null>(null);
  const [yesNo, setYesNo] = useState<boolean | null>(null);
  const [alias, setAlias] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [alreadyVoted, setAlreadyVoted] = useState(false);
  const [shake, setShake] = useState(false);

  useEffect(() => {
    const es = new EventSource(`/api/polls/${poll.id}/stream`);
    es.onmessage = (ev) => {
      const data = JSON.parse(ev.data);
      setPoll((p) => ({ ...p, totalVotes: data.poll.totalVotes ?? p.totalVotes }));
    };
    return () => es.close();
  }, [poll.id]);

  const timeLeft = formatTimeRemaining(poll.expiresAt);
  const urgent = isUrgent(poll.expiresAt);

  const hasSelection =
    poll.type === "single_choice"
      ? !!singleId
      : poll.type === "multiple_choice"
        ? optionIds.length > 0
        : poll.type === "rating"
          ? rating !== null
          : yesNo !== null;

  if (!unlocked) {
    return (
      <PasswordGate
        onUnlock={(p) => {
          setPassword(p);
          setUnlocked(true);
        }}
      />
    );
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
    if (!hasSelection) return;
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
        if (data.error === "already_voted") setAlreadyVoted(true);
        if (data.error === "invalid_password") {
          setShake(true);
          setTimeout(() => setShake(false), 400);
        }
        setError(data.error);
        return;
      }
      setDone(true);
    } catch {
      setError("network_error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-[560px] px-4 py-6">
      {alreadyVoted && (
        <div className="mb-4 rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-700 dark:text-amber-200">
          You already voted on this poll.
          {poll.settings.showResultsBeforeClose && (
            <Link
              href={`/poll/${poll.id}/results`}
              className="ml-2 font-medium underline"
            >
              View results
            </Link>
          )}
        </div>
      )}

      <Card
        className={`overflow-hidden ${shake ? "qp-shake" : ""}`}
        style={{
          borderTopWidth: 4,
          borderTopColor: poll.accentColor,
          background: `linear-gradient(180deg, ${poll.accentColor}12 0%, transparent 120px)`,
        }}
      >
        <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
          <Badge tone="violet">{POLL_TYPE_LABELS[poll.type]}</Badge>
          <span className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
            <span className="qp-live-dot size-2 rounded-full bg-emerald-500" />
            {poll.totalVotes} votes
          </span>
        </div>

        <h1 className="font-display text-2xl font-bold text-[var(--text-primary)]">{poll.title}</h1>
        {poll.description && (
          <p className="mt-2 text-[var(--text-secondary)]">{poll.description}</p>
        )}
        {timeLeft && (
          <p
            className={`mt-3 flex items-center gap-1 text-sm ${urgent ? "text-amber-600 dark:text-amber-400" : "text-[var(--text-muted)]"}`}
          >
            🕐 {timeLeft}
          </p>
        )}

        <form onSubmit={submit} className="mt-8 space-y-6">
          <PollOptions
            type={poll.type}
            poll={poll}
            singleId={singleId}
            setSingleId={setSingleId}
            optionIds={optionIds}
            setOptionIds={setOptionIds}
            rating={rating}
            setRating={setRating}
            yesNo={yesNo}
            setYesNo={setYesNo}
          />

          {poll.settings.requireAlias && (
            <div>
              <label className="text-xs text-[var(--text-secondary)]">👤 Your name *</label>
              <Input
                className="mt-1"
                value={alias}
                onChange={(e) => setAlias(e.target.value)}
                required
              />
            </div>
          )}
          {!poll.settings.requireAlias && (
            <div>
              <label className="text-xs text-[var(--text-secondary)]">👤 Your name (optional)</label>
              <Input
                className="mt-1"
                value={alias}
                onChange={(e) => setAlias(e.target.value)}
              />
            </div>
          )}
          {poll.settings.allowComments && (
            <div>
              <label className="text-xs text-[var(--text-secondary)]">Comment (optional)</label>
              <Textarea
                className="mt-1"
                rows={2}
                maxLength={200}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>
          )}

          {error && error !== "already_voted" && (
            <p className="text-sm text-red-400">
              {error === "invalid_password"
                ? "Wrong password"
                : "Could not submit vote"}
            </p>
          )}

          <Button
            type="submit"
            variant="cta"
            className="w-full"
            disabled={loading || !hasSelection || alreadyVoted}
          >
            {loading ? "Submitting…" : "Cast my vote →"}
          </Button>
        </form>
      </Card>
    </div>
  );
}

function PollOptions({
  type,
  poll,
  singleId,
  setSingleId,
  optionIds,
  setOptionIds,
  rating,
  setRating,
  yesNo,
  setYesNo,
}: {
  type: PollType;
  poll: VotePoll;
  singleId: string | null;
  setSingleId: (id: string) => void;
  optionIds: string[];
  setOptionIds: (ids: string[]) => void;
  rating: number | null;
  setRating: (n: number) => void;
  yesNo: boolean | null;
  setYesNo: (v: boolean) => void;
}) {
  if (type === "single_choice")
    return (
      <SingleChoice
        options={poll.options}
        value={singleId}
        accentColor={poll.accentColor}
        onChange={setSingleId}
      />
    );
  if (type === "multiple_choice")
    return (
      <MultipleChoice
        options={poll.options}
        value={optionIds}
        maxChoices={poll.settings.maxChoices ?? 3}
        accentColor={poll.accentColor}
        onChange={setOptionIds}
      />
    );
  if (type === "rating")
    return (
      <RatingScale
        value={rating}
        accentColor={poll.accentColor}
        onChange={setRating}
      />
    );
  return (
    <YesNo value={yesNo} accentColor={poll.accentColor} onChange={setYesNo} />
  );
}
