export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--border-subtle)] py-8 text-center text-sm text-[var(--text-muted)]">
      QuickPoll · Built with ☁ on AWS ·{" "}
      <a
        href="https://github.com/Nehemie-Jacques/QuickPoll-"
        className="text-[var(--text-secondary)] underline-offset-2 hover:text-[var(--brand)] hover:underline"
        target="_blank"
        rel="noopener noreferrer"
      >
        Open source on GitHub
      </a>
    </footer>
  );
}
