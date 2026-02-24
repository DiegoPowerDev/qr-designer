"use client";
import QrGenerator from "@/components/qrgenerator";
import { useThemeStore } from "@/store/themeStore";
import { Info, Moon, Sun } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";

export default function Home() {
  const theme = useThemeStore((s) => s.theme);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);
  const background = useThemeStore((s) => s.background);
  const text = useThemeStore((s) => s.text);
  const [open, setOpen] = useState(false);

  return (
    <>
      <main
        style={{ background: theme === "dark" ? "#000000" : "#FFF085" }}
        className={`flex w-full h-full flex-col items-center justify-center py-4 `}
      >
        <div
          onClick={() => setOpen(true)}
          className="hidden md:block  absolute top-10 left-20 "
        >
          <Info color={text} />
        </div>
        <div className="flex w-full  md:hidden p-2 px-8 rounded gap-4 justify-between ">
          <div onClick={() => setOpen(true)}>
            <Info color={text} />
          </div>

          <div
            onClick={() => toggleTheme()}
            className=" active:scale-125 transition-all"
          >
            {theme === "dark" ? <Sun color={text} /> : <Moon color={text} />}
          </div>
        </div>
        <QrGenerator />
        <div
          onClick={() => toggleTheme()}
          className="hidden md:block absolute top-10 right-20 active:scale-125 transition-all"
        >
          {theme === "dark" ? <Sun color={text} /> : <Moon color={text} />}
        </div>
        <a
          style={{ color: text }}
          target="_blank"
          href="https://diegotorres-portfoliodev.vercel.app"
          className="hidden md:block  absolute bottom-0 right-10  "
        >
          creado por Diego Torres
        </a>
      </main>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent style={{ color: text, background: background }}>
          <DialogHeader>
            <DialogTitle className="flex gap-2 items-center mb-2">
              <Info />
              Información
            </DialogTitle>
            <DialogDescription>
              QR gratuitos para siempre. Sin caducidad, sin publicidad y sin
              rastreadores. Proyecto desarrollado bajo la filosofía de software
              libre. Si buscas un desarrollador con este nivel de atención al
              detalle, visita mi portafolio:
              <br />
              <a
                target="_blank"
                href="https://diegotorres-portfoliodev.vercel.app"
                style={{
                  background: theme === "dark" ? "#000000" : "#FFF085",
                  color: theme === "dark" ? "#fafafa" : "#000000",
                }}
                className="flex justify-center mt-4 font-bold p-2 rounded hover:opacity-80"
              >
                Diego Torres
              </a>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
