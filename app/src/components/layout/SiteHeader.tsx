"use client";

import { Logo } from "./Logo";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export function SiteHeader() {
  return (
    <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-5 sm:px-6">
      <Logo />
      <ThemeToggle />
    </header>
  );
}
