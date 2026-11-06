export const THEME_STORAGE_KEY = "honestcv.theme";

export type Theme = "light" | "dark";

/** Runs before hydration so the saved theme is applied on first paint. */
export const THEME_INIT_SCRIPT = `(function(){try{var key="${THEME_STORAGE_KEY}";var stored=localStorage.getItem(key);var theme=stored==="dark"||stored==="light"?stored:(window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");document.documentElement.setAttribute("data-theme",theme);}catch(e){}})();`;

export function getCurrentTheme(): Theme {
  const current = document.documentElement.getAttribute("data-theme");

  if (current === "dark" || current === "light") return current;

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function applyTheme(theme: Theme): void {
  document.documentElement.setAttribute("data-theme", theme);

  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Storage can be unavailable in privacy-restricted contexts.
  }
}
