export function SiteFooter() {
  return (
    <footer className="border-t border-zinc-800/80 py-8 text-center text-sm text-zinc-600">
      QuickPoll · Built with ☁ on AWS ·{" "}
      <a
        href="https://github.com"
        className="underline-offset-2 hover:text-zinc-400 hover:underline"
        target="_blank"
        rel="noopener noreferrer"
      >
        Open source on GitHub
      </a>
    </footer>
  );
}
