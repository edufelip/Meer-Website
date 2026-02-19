export type ThemePreference = "light" | "dark";

export const THEME_STORAGE_KEY = "gb_theme";

export function normalizeTheme(value: string | null | undefined): ThemePreference {
  return value === "dark" ? "dark" : "light";
}

export function applyTheme(theme: ThemePreference): void {
  if (typeof document === "undefined") {
    return;
  }

  const root = document.documentElement;
  const isDark = theme === "dark";
  root.classList.toggle("dark", isDark);
  root.style.colorScheme = theme;
}
