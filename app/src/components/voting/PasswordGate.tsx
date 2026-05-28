"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";

interface PasswordGateProps {
  onUnlock: (password: string) => void;
}

export function PasswordGate({ onUnlock }: PasswordGateProps) {
  return (
    <Card className="mx-auto max-w-md space-y-4 text-center">
      <h2 className="text-lg font-semibold">Sondage protégé</h2>
      <p className="text-sm text-zinc-500">Entrez le mot de passe pour voter</p>
      <form
        className="space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          onUnlock(String(fd.get("password") ?? ""));
        }}
      >
        <Input name="password" type="password" required autoFocus />
        <Button type="submit" className="w-full">
          Accéder
        </Button>
      </form>
    </Card>
  );
}
