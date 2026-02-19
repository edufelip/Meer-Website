"use client";

import { useEffect, useState } from "react";
import { THEME_STORAGE_KEY, applyTheme, normalizeTheme, type ThemePreference } from "./theme";

type ThemeToggleButtonProps = {
  className?: string;
};

function nextTheme(theme: ThemePreference): ThemePreference {
  return theme === "light" ? "dark" : "light";
}

const defaultButtonClassName =
  "inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--ink)] shadow-[var(--shadow-soft)] transition-colors hover:bg-[var(--surface-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]";

export default function ThemeToggleButton({ className }: ThemeToggleButtonProps) {
  const [theme, setTheme] = useState<ThemePreference>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = normalizeTheme(window.localStorage.getItem(THEME_STORAGE_KEY));
    setTheme(stored);
    applyTheme(stored);
    setMounted(true);
  }, []);

  const handleToggle = () => {
    setTheme((currentTheme) => {
      const updatedTheme = nextTheme(currentTheme);
      applyTheme(updatedTheme);
      window.localStorage.setItem(THEME_STORAGE_KEY, updatedTheme);
      return updatedTheme;
    });
  };

  const label = theme === "dark" ? "Ativar tema claro" : "Ativar tema escuro";
  const resolvedClassName = className && className.trim() ? className : defaultButtonClassName;

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={handleToggle}
      className={resolvedClassName}
    >
      <span aria-hidden className="text-lg leading-none">
        {mounted && theme === "dark" ? "☀" : "☾"}
      </span>
    </button>
  );
}
