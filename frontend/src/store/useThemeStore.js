import { create } from "zustand";
import { THEMES } from "../constants";

const LIGHT_THEMES = ["caffeine-light", "notebook-light"];
const VALID_THEMES = new Set(THEMES);

function getDefaultTheme() {
  if (typeof window === "undefined") return "caffeine-light";
  try {
    const saved = localStorage.getItem("chat-theme");
    if (saved && VALID_THEMES.has(saved)) return saved;
  } catch (_) {}
  return "caffeine-light";
}

export const useThemeStore = create((set, get) => ({
  theme: getDefaultTheme(),
  setTheme: (theme) => {
    if (!theme || !VALID_THEMES.has(theme)) return;
    try {
      localStorage.setItem("chat-theme", theme);
    } catch (_) {}
    set({ theme });
  },
  isDark: () => !LIGHT_THEMES.includes(get().theme),
  toggleLightDark: () => {
    const current = get().theme;
    const map = {
      "caffeine-light": "caffeine-dark",
      "caffeine-dark": "caffeine-light",
      "notebook-light": "notebook-dark",
      "notebook-dark": "notebook-light",
    };
    get().setTheme(map[current] || "caffeine-light");
  },
}));
