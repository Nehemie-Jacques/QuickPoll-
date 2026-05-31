"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";

export function PasswordGate({ onUnlock }: { onUnlock: (p: string) => void }) {
  const [shake, setShake] = useState(false);
  const [error, setError] = useState(false);

  return (
    <Card className="mx-auto max-w-md space-y-4 text-center">
      <div className="text-4xl">🔒</div>
      <h2 className="font-display text-xl font-semibold">Protected poll</h2>
      <p className="text-sm text-zinc-500">Enter the password to vote</p>
      <form
        className="space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          const p = String(fd.get("password") ?? "");
          if (!p) {
            setError(true);
            setShake(true);
            setTimeout(() => setShake(false), 400);
            return;
          }
          onUnlock(p);
        }}
      >
        <Input
          name="password"
          type="password"
          autoFocus
          className={shake ? "qp-shake border-red-500" : error ? "border-red-500" : ""}
        />
        <Button type="submit" variant="cta" className="w-full">
          Unlock poll
        </Button>
      </form>
    </Card>
  );
}
