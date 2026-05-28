"use client";

import { useEffect, useState } from "react";
import { Button } from "./Button";

export function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  }

  return (
    <Button variant="ghost" type="button" onClick={toggle} aria-label="Toggle theme">
      {dark ? "☀️" : "🌙"}
    </Button>
  );
}
