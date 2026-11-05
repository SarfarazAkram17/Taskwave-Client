import { useCallback, useEffect, useMemo, useState } from "react";
import { ThemeContext } from "./themeCtx";

const KEY = "taskwave-theme";
const systemTheme = () =>
  window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
const readSaved = () => {
  try {
    const v = localStorage.getItem(KEY);
    return v === "light" || v === "dark" ? v : null;
  } catch {
    return null;
  }
};

export default function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => readSaved() || systemTheme());

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // Until the visitor chooses a theme, keep following the operating system.
  useEffect(() => {
    const mq = window.matchMedia?.("(prefers-color-scheme: dark)");
    if (!mq) return;
    const onChange = () => { if (!readSaved()) setThemeState(mq.matches ? "dark" : "light"); };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const setTheme = useCallback((next) => {
    setThemeState(next);
    try { localStorage.setItem(KEY, next); } catch { /* storage unavailable */ }
  }, []);
  const toggleTheme = useCallback(() => setTheme(theme === "dark" ? "light" : "dark"), [theme, setTheme]);

  const value = useMemo(() => ({ theme, toggleTheme, setTheme }), [theme, toggleTheme, setTheme]);
  return <ThemeContext value={value}>{children}</ThemeContext>;
}
