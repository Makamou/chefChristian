import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./App.css";
import { Header } from "./components/Header.jsx";
import { Entry } from "./components/Entry.jsx";
import { Footer } from "./components/Footer.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <div className="app-shell">
      <Header />
      <Entry />
      <Footer />
    </div>
  </StrictMode>
);
