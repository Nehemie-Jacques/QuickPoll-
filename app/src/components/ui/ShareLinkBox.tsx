import type { ReactNode } from "react";
import { Badge } from "@/components/ui/Badge";

type BadgeTone = "violet" | "live" | "muted" | "warning" | "gold";

type ShareLinkBoxProps = {
  badge: string;
  badgeTone: BadgeTone;
  label: string;
  url: string;
  variant?: "public" | "private";
  actions?: ReactNode;
};

export function ShareLinkBox({
  badge,
  badgeTone,
  label,
  url,
  variant = "public",
  actions,
}: ShareLinkBoxProps) {
  const isPublic = variant === "public";

  return (
    <div
      className={`min-w-0 overflow-hidden rounded-2xl p-4 sm:p-5 ${
        isPublic
          ? "border-2 border-violet-500/50 bg-gradient-to-br from-violet-600/10 to-blue-600/5"
          : "border border-[var(--border-subtle)] bg-[var(--bg-elevated)]/50"
      }`}
    >
      <div className="mb-3 flex min-w-0 flex-col items-start gap-2 sm:flex-row sm:items-center">
        <Badge tone={badgeTone} className="shrink-0">
          {badge}
        </Badge>
        <span
          className={`min-w-0 text-xs font-semibold uppercase tracking-wide ${
            isPublic ? "text-violet-400" : "text-[var(--text-secondary)]"
          }`}
        >
          {label}
        </span>
      </div>

      <div className="min-w-0 max-w-full overflow-hidden rounded-lg bg-[var(--bg-elevated)]/80 p-3">
        <p
          className={`qp-url-text font-mono leading-relaxed ${
            isPublic
              ? "text-xs text-[var(--text-primary)] sm:text-sm"
              : "text-xs text-[var(--text-secondary)]"
          }`}
        >
          {url}
        </p>
      </div>

      {actions ? <div className="mt-4 min-w-0">{actions}</div> : null}
    </div>
  );
}