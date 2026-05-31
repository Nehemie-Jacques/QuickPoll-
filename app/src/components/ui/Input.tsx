import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

export function Input({
  className = "",
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`qp-input w-full px-4 py-3 text-sm placeholder:text-zinc-500 ${className}`}
      {...props}
    />
  );
}

export function Textarea({
  className = "",
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={`qp-input w-full resize-none px-4 py-3 text-sm placeholder:text-zinc-500 ${className}`}
      {...props}
    />
  );
}
