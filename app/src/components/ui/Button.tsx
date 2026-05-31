import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "cta" | "secondary" | "ghost" | "danger";

const variants: Record<Variant, string> = {
  primary: "qp-btn-primary font-medium",
  cta: "qp-btn-cta font-semibold",
  secondary:
    "border border-zinc-700 bg-transparent text-zinc-200 hover:bg-zinc-800",
  ghost: "border border-zinc-700 bg-transparent text-zinc-300 hover:bg-zinc-800/80",
  danger: "bg-red-600 text-white hover:bg-red-500",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  children: ReactNode;
}

export function Button({
  variant = "primary",
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-[10px] px-6 py-3 text-sm transition disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
