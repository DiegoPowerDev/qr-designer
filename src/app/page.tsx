"use client";
import QrGenerator from "@/components/qrgenerator";
import { useThemeStore } from "@/store/themeStore";
import { Moon, Sun } from "lucide-react";

export default function Home() {
  const theme = useThemeStore((s) => s.theme);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);
  const background = useThemeStore((s) => s.background);
  const text = useThemeStore((s) => s.text);

  return (
    <main
      style={{ background: theme === "dark" ? "#000000" : "#FFF085" }}
      className={`flex w-full h-full flex-col items-center justify-center py-4 `}
    >
      <QrGenerator />
      <div
        onClick={() => toggleTheme()}
        className="absolute top-10 right-20 active:scale-125 transition-all"
      >
        {theme === "dark" ? <Sun color={text} /> : <Moon color={text} />}
      </div>
    </main>
  );
}
