"use client";

import { Logo } from "./Logo";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export function SiteHeader() {
  return (
    <header className="w-full shrink-0 border-b border-[var(--border-subtle)]/50">
      <div className="mx-auto flex w-full max-w-5xl min-w-0 items-center justify-between px-4 py-4 sm:px-6">
        <Logo />
        <ThemeToggle />
      </div>
    </header>
  );
}
