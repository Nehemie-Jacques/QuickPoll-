import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5">
      <span className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-blue-600 shadow-lg shadow-violet-900/40">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden
        >
          <path
            d="M5 6h14a2 2 0 012 2v6a2 2 0 01-2 2H9l-4 3v-3H5a2 2 0 01-2-2V8a2 2 0 012-2z"
            stroke="white"
            strokeWidth="1.5"
          />
          <rect x="9" y="11" width="2" height="4" rx="0.5" fill="white" />
          <rect x="12" y="9" width="2" height="6" rx="0.5" fill="white" />
          <rect x="15" y="12" width="2" height="3" rx="0.5" fill="white" />
        </svg>
      </span>
      <span className="font-display text-lg font-bold tracking-tight text-[var(--text-primary)]">
        QuickPoll
      </span>
    </Link>
  );
}
