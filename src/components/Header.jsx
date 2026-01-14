import { useEffect, useState } from "react";
import chefChristianLogoW from "../../public/logoW.png";
import chefChristianLogoB from "../../public/LogoB.png";

export function Header() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  function toggleTheme() {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  }

  return (
    <header>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <img
          className="logo-Chef"
          src={theme === "dark" ? chefChristianLogoB : chefChristianLogoW}
        />
        <span>Chef Christian</span>
      </div>

      <button
        className={`theme-toggle ${theme}`}
        onClick={toggleTheme}
        aria-label="Toggle dark mode"
      >
        <span>{theme === "light" ? "🌙" : "☀️"}</span>
      </button>
    </header>
  );
}
