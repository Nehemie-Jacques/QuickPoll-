"use client";

import { Input } from "@/components/ui/Input";

interface AliasInputProps {
  value: string;
  required?: boolean;
  onChange: (value: string) => void;
}

export function AliasInput({ value, required, onChange }: AliasInputProps) {
  return (
    <div>
      <label className="text-sm font-medium">
        Alias {required && <span className="text-red-500">*</span>}
      </label>
      <Input
        maxLength={40}
        placeholder="Comment vous appeler ?"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="mt-1"
      />
    </div>
  );
}
