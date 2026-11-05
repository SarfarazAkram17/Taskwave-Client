import { useContext } from "react";
import { ThemeContext } from "./themeCtx";

export const useTheme = () => useContext(ThemeContext);
