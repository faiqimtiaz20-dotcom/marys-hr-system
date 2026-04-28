"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

type ThemeMode = "light" | "dark" | "system";

function applyTheme(next: ThemeMode) {
  const root = document.documentElement;

  if (next === "system") {
    root.removeAttribute("data-theme");
    window.localStorage.removeItem("theme-mode");
    return;
  }

  root.setAttribute("data-theme", next);
  window.localStorage.setItem("theme-mode", next);
}

export function ThemeToggle() {
  const [mode, setMode] = useState<ThemeMode>(() => {
    if (typeof window === "undefined") {
      return "system";
    }
    const saved = window.localStorage.getItem("theme-mode") as ThemeMode | null;
    return saved ?? "system";
  });

  useEffect(() => {
    applyTheme(mode);
  }, [mode]);

  const toggleTheme = () => {
    const next: ThemeMode = mode === "dark" ? "light" : "dark";
    setMode(next);
    applyTheme(next);
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex h-10 w-10 items-center justify-center rounded-xl border bg-surface transition hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      aria-label="Toggle theme"
    >
      {mode === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}
