"use client";

import { createContext, useContext, useEffect } from "react";

import { getLS, storeLS } from "../localStorage";

export const ThemeContext = createContext<{
  themeMode: "light" | "dark";
  toggleTheme: () => void;
}>({
  themeMode: "dark",
  toggleTheme: () => {},
});

export default function useThemeContext() {
  return useContext(ThemeContext);
}

export function useThemeHandler(themeMode, setThemeMode) {
  useEffect(() => {
    if (!setThemeMode) return;
    let lsMode = getLS("theme-mode");
    if (lsMode) {
      setThemeMode(lsMode);
    } else {
      storeLS("theme-mode", themeMode, true);
    }
  }, [setThemeMode]);
}
