export function SiteFooter() {
  return (
    <footer className="relative z-10 border-t border-[var(--border-subtle)] px-4 py-8 text-center text-sm text-[var(--text-muted)]">
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
    </footer>
  );
}
