"use client";

import { useEffect, useState } from "react";
import { THEME_STORAGE_KEY, applyTheme, type ThemePreference } from "./theme";
import { trackEvent } from "../analytics/mixpanel";

type ThemeToggleButtonProps = {
  className?: string;
};

function nextTheme(theme: ThemePreference): ThemePreference {
  return theme === "light" ? "dark" : "light";
}

const defaultButtonClassName = "p-2 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors text-stone-600 dark:text-stone-300";

export default function ThemeToggleButton({ className }: ThemeToggleButtonProps) {
  const [theme, setTheme] = useState<ThemePreference>("light");

  useEffect(() => {
    const systemPreference = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY) as ThemePreference | null;
    const initialTheme = stored || systemPreference;
    setTheme(initialTheme);
    applyTheme(initialTheme);
  }, []);

  const handleToggle = () => {
    setTheme((currentTheme) => {
      const updatedTheme = nextTheme(currentTheme);
      applyTheme(updatedTheme);
      window.localStorage.setItem(THEME_STORAGE_KEY, updatedTheme);
      trackEvent("Theme Toggled", { theme: updatedTheme });
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
      <span aria-hidden className="material-icons-outlined dark:hidden">dark_mode</span>
      <span aria-hidden className="material-icons-outlined hidden dark:block">light_mode</span>
    </button>
  );
}
