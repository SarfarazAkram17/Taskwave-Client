import { LuMoon, LuSun } from "react-icons/lu";
import { useTheme } from "../../context/useTheme";

const ThemeToggle = ({ className = "" }) => {
  const { theme, toggleTheme } = useTheme();
  const dark = theme === "dark";
  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`btn btn-ghost btn-icon ${className}`}
      aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
      title={dark ? "Switch to light theme" : "Switch to dark theme"}
    >
      {dark ? <LuSun size={18} /> : <LuMoon size={18} />}
    </button>
  );
};

export default ThemeToggle;
