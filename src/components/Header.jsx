import { useEffect, useState } from "react";
import chefChristianLogoW from "../../public/logoW.png";
import chefChristianLogoB from "../../public/LogoB.png";

export function Header() {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = window.localStorage.getItem("cc-theme");
      if (saved === "light" || saved === "dark") return saved;
      if (window.matchMedia?.("(prefers-color-scheme: dark)").matches) {
        return "dark";
      }
    }
    return "light";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try {
      window.localStorage.setItem("cc-theme", theme);
    } catch {
      /* ignore */
    }
  }, [theme]);

  function toggleTheme() {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  }

  return (
    <header className="site-header">
      <div className="brand">
        <img
          className="logo-Chef"
          src={theme === "dark" ? chefChristianLogoB : chefChristianLogoW}
          alt="Chef Christian logo"
        />
        <div className="brand-text">
          <span className="brand-name">Chef Christian</span>
          <span className="brand-tagline">AI Recipe Companion</span>
        </div>
      </div>

      <button
        className={`theme-toggle ${theme}`}
        onClick={toggleTheme}
        aria-label={
          theme === "light" ? "Switch to dark mode" : "Switch to light mode"
        }
        title={theme === "light" ? "Dark mode" : "Light mode"}
      >
        <span>{theme === "light" ? "🌙" : "☀️"}</span>
      </button>
    </header>
  );
}
