"use client";

import { Input } from "@/components/ui/Input";

interface CommentInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function CommentInput({ value, onChange }: CommentInputProps) {
  return (
    <div>
      <label className="text-sm font-medium">Commentaire (court)</label>
      <Input
        maxLength={200}
        placeholder="Votre commentaire…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1"
      />
    </div>
  );
}
