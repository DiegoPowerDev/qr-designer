import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ThemeState {
  theme: "light" | "dark";
  text: string;
  background: string;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: "dark",
      background: "#4D179A",
      text: "#fafafa",
      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === "light" ? "dark" : "light",
          background: state.theme === "light" ? "#4D179A" : "#EB9C41",
          text: state.theme === "light" ? "#fafafa" : "#000000",
        })),
    }),
    { name: "theme-storage" },
  ),
);
