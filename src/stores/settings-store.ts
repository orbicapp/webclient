import { StorageKeys } from "@/lib/storage/local-keys";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SettingsState {
  theme: "light" | "dark";
  sidebarOpen: boolean;

  toggleTheme: () => void;
  toggleSidebar: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      // Getters
      theme: "light",
      sidebarOpen: false,

      // Setters
      toggleTheme: () => {
        const newTheme = document.documentElement.classList.contains("dark")
          ? "light"
          : "dark";
        if (newTheme === "dark") {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
        set({ theme: newTheme });
      },

      toggleSidebar: () =>
        set((state) => ({ sidebarOpen: !state.sidebarOpen })),
    }),
    {
      name: StorageKeys.PREFERENCES,
      onRehydrateStorage: (state) => {
        // Apply theme on page load
        if (state?.theme === "dark") {
          document.documentElement.classList.add("dark");
        }
      },
    }
  )
);
