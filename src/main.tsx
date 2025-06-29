import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";

import "./styles/globals.css";

// Initialize theme before React renders
const initializeTheme = () => {
  try {
    const stored = localStorage.getItem("orbic:app:settings");
    if (stored) {
      const parsed = JSON.parse(stored);
      const theme = parsed.state?.theme;
      if (theme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  } catch (error) {
    console.warn("Failed to initialize theme:", error);
  }
};

// Apply theme immediately
initializeTheme();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);