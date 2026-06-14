export function SiteFooter() {
  return (
    <footer className="w-full shrink-0 border-t border-[var(--border-subtle)]/50 py-6 text-center text-sm text-[var(--text-muted)]">
      <div className="mx-auto w-full max-w-5xl min-w-0 px-4 sm:px-6">
        <p>
          QuickPoll ·{" "}
          <a
            href="https://quick-poll-ba18.vercel.app/"
            className="text-[var(--text-secondary)] underline-offset-2 hover:text-[var(--brand)] hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Live demo
          </a>
          {" · "}
          <a
            href="https://github.com/Nehemie-Jacques/QuickPoll-"
            className="text-[var(--text-secondary)] underline-offset-2 hover:text-[var(--brand)] hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        </p>
      </div>
    </footer>
  );
}
