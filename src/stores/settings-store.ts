import { LocalKeys } from "@/lib/storage/local-keys";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SettingsState {
  theme: "light" | "dark";
  sidebarOpen: boolean;

  toggleTheme: () => void;
  toggleSidebar: () => void;
  setTheme: (theme: "light" | "dark") => void;
}

// Function to apply theme to DOM
const applyTheme = (theme: "light" | "dark") => {
  if (theme === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
};

// Initialize theme from localStorage immediately
const getInitialTheme = (): "light" | "dark" => {
  if (typeof window === "undefined") return "light";
  
  try {
    const stored = localStorage.getItem(LocalKeys.PREFERENCES);
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.state?.theme || "light";
    }
  } catch (error) {
    console.warn("Failed to parse stored theme:", error);
  }
  
  return "light";
};

// Apply initial theme immediately
const initialTheme = getInitialTheme();
applyTheme(initialTheme);

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      // Getters - Use the initial theme we detected
      theme: initialTheme,
      sidebarOpen: false,

      // Setters
      setTheme: (theme) => {
        applyTheme(theme);
        set({ theme });
      },

      toggleTheme: () => {
        const currentTheme = get().theme;
        const newTheme = currentTheme === "dark" ? "light" : "dark";
        applyTheme(newTheme);
        set({ theme: newTheme });
      },

      toggleSidebar: () =>
        set((state) => ({ sidebarOpen: !state.sidebarOpen })),
    }),
    {
      name: LocalKeys.PREFERENCES,
      onRehydrateStorage: () => (state) => {
        // Apply theme when store rehydrates
        if (state?.theme) {
          applyTheme(state.theme);
        }
      },
    }
  )
);