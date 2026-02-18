"use client";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  Download,
  Globe,
  Palette,
  Settings2,
  Link as LinkIcon,
  Wifi,
  EyeOff,
  Eye,
  Trash2,
  Info,
} from "lucide-react";

// Shadcn UI
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogoDnD } from "./LogoDnD";
import { useThemeStore } from "@/store/themeStore";

export default function QrGenerator() {
  const [mode, setMode] = useState("url");
  const [qrValue, setQrValue] = useState("");

  // Estados de Apariencia
  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [level, setLevel] = useState<"L" | "M" | "Q" | "H">("H");
  const [logo, setLogo] = useState<string | null>(null);
  const [logoSize, setLogoSize] = useState(50);

  // Estados URL
  const [url, setUrl] = useState("https://");

  // Estados WIFI
  const [wifiName, setWifiName] = useState("");
  const [wifiPass, setWifiPass] = useState("123");
  const [wifiEncryption, setWifiEncryption] = useState("WPA");
  const [showPass, setShowPass] = useState(false);

  const background = useThemeStore((s) => s.background);
  const text = useThemeStore((s) => s.text);

  // Lógica de generación del valor del QR
  useEffect(() => {
    if (mode === "url") {
      setQrValue(url);
    } else {
      const encryption =
        wifiEncryption === "none" ? "" : `T:${wifiEncryption};`;
      const password = wifiEncryption === "none" ? "" : `P:${wifiPass};`;
      setQrValue(`WIFI:S:${wifiName};${encryption}${password};;`);
    }
  }, [mode, url, wifiName, wifiPass, wifiEncryption]);

  const downloadQR = (format: "png" | "svg" | "webp") => {
    const svgElement = document.getElementById(
      "qr-svg",
    ) as unknown as SVGElement;
    if (!svgElement) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    const svgBlob = new Blob([svgData], {
      type: "image/svg+xml;charset=utf-8",
    });
    const urlBlob = URL.createObjectURL(svgBlob);

    if (format === "svg") {
      const link = document.createElement("a");
      link.href = urlBlob;
      link.download = `qr-custom.svg`;
      link.click();
      return;
    }

    img.onload = () => {
      canvas.width = 1200;
      canvas.height = 1200;
      if (ctx) {
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, 1200, 1200);
        const dataUrl = canvas.toDataURL(`image/${format}`, 1.0);
        const link = document.createElement("a");
        link.download = `qr-custom.${format}`;
        link.href = dataUrl;
        link.click();
      }
      URL.revokeObjectURL(urlBlob);
    };
    img.src = urlBlob;
  };

  return (
    <div className=" grid grid-cols-1 md:grid-cols-2 w-11/12 md:w-7/12 justify-center gap-8 h-full 2xl:h-3/4 2xl:py-6">
      <div className="flex justify-center items-start">
        {/* COLUMNA IZQUIERDA: CONFIGURACIÓN */}

        <Tabs
          defaultValue="url"
          onValueChange={setMode}
          className="w-full h-full"
        >
          <TabsList
            style={{ background: background, color: text }}
            className={`grid w-full  grid-cols-2    rounded-xl  `}
          >
            <TabsTrigger value="url" className="rounded-lg">
              <LinkIcon className="w-4 h-4 mr-2 font-bold" /> URL
            </TabsTrigger>
            <TabsTrigger value="wifi" className="rounded-lg">
              <Wifi className="w-4 h-4 mr-2 font-bold" /> Wi-Fi
            </TabsTrigger>
          </TabsList>

          <div
            style={{ background: background, color: text }}
            className={`border-none shadow-xl text-white backdrop-blur-sm h-full flex flex-col gap-2 px-6 py-4 rounded-xl`}
          >
            <div className="flex items-center gap-2 text-2xl font-bold py-2">
              <Settings2 className="w-6 h-6  " />
              Configuración
            </div>
            <div className="h-full  flex flex-col justify-between">
              <TabsContent
                value="url"
                className="flex flex-col justify-start border p-4 rounded-xl"
              >
                <div className="flex flex-col gap-2 ">
                  <Label
                    htmlFor="url"
                    className="font-bold flex items-center gap-2"
                  >
                    <Globe className="w-4 h-4" /> URL :
                  </Label>
                  <Input
                    id="url"
                    placeholder="https://tu-sitio.com"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="h-12 rounded-xl bg-white text-black"
                  />
                </div>
              </TabsContent>

              <TabsContent
                value="wifi"
                className="flex flex-col justify-start border p-4 rounded-xl"
              >
                <div className="flex flex-col gap-4">
                  <div className=" flex flex-col gap-2">
                    <Label
                      htmlFor="ssid"
                      className="font-bold flex items-center gap-2"
                    >
                      Nombre de la Red (SSID)
                    </Label>
                    <Input
                      id="ssid"
                      placeholder="Nombre de red WI-FI"
                      value={wifiName}
                      onChange={(e) => setWifiName(e.target.value)}
                      className="h-9 rounded-xl bg-white text-black"
                    />
                  </div>
                  <div className="flex flex-col md:flex-row w-full gap-2">
                    <div className="flex flex-col gap-2">
                      <Label className="font-bold">Seguridad</Label>
                      <Select
                        value={wifiEncryption}
                        onValueChange={setWifiEncryption}
                      >
                        <SelectTrigger className="h-12 rounded-xl">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent position="popper">
                          <SelectItem value="WPA">WPA/WPA2</SelectItem>
                          <SelectItem value="WEP">WEP</SelectItem>
                          <SelectItem value="none">Abierta</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {wifiEncryption !== "none" && (
                      <div className="flex flex-col gap-2">
                        <Label className="font-bold">Contraseña</Label>
                        <div className="relative">
                          <Input
                            type={showPass ? "text" : "password"}
                            value={wifiPass}
                            onChange={(e) => setWifiPass(e.target.value)}
                            className="h-9 rounded-xl bg-white text-black"
                          />
                          <button
                            onClick={() => setShowPass(!showPass)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-700 cursor-pointer"
                          >
                            {showPass ? (
                              <EyeOff size={16} />
                            ) : (
                              <Eye size={16} />
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              {/* OPCIONES DE APARIENCIA (COMUNES) */}
              <div className="pt-2">
                <div className="flex w-full p-4 border rounded-xl justify-center gap-4  ">
                  <div className="flex flex-col items-center">
                    <Label
                      htmlFor="color1"
                      className="text-xs uppercase font-bold  "
                    >
                      Color QR
                    </Label>

                    <input
                      id="color1"
                      type="color"
                      value={fgColor}
                      onChange={(e) => setFgColor(e.target.value)}
                      className="w-16 h-16  cursor-pointer  "
                    />
                  </div>
                  <div className="flex flex-col items-center">
                    <Label
                      htmlFor="color2"
                      className="text-xs uppercase font-bold "
                    >
                      Fondo
                    </Label>

                    <input
                      id="color2"
                      type="color"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="w-16 h-16 cursor-pointer  "
                    />
                  </div>
                  <div className="flex flex-col items-center gap-2 ">
                    <div className="flex gap-2">
                      <Label className="text-xs uppercase font-bold ">
                        Redundancia
                      </Label>

                      <Tooltip delayDuration={300}>
                        <TooltipTrigger asChild>
                          <Info className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-[280px] p-4">
                          <div className="space-y-2">
                            <p className="font-bold text-sm">
                              Capacidad de Recuperación
                            </p>
                            <p className="text-xs leading-relaxed">
                              Permite que el QR sea legible incluso si está
                              **dañado, sucio o cubierto por un logo**.
                            </p>
                            <ul className="text-xs list-disc pl-4 space-y-1">
                              <li>
                                <strong>Nivel H (Máximo):</strong> Recomendado
                                si usas logos grandes.
                              </li>
                              <li>
                                <strong>Nivel L (Bajo):</strong> Crea un QR más
                                simple y limpio, pero muy sensible a daños.
                              </li>
                            </ul>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <Select
                      value={level}
                      onValueChange={(v: any) => setLevel(v)}
                    >
                      <SelectTrigger
                        aria-label="Redundancia"
                        className="h-9 rounded-xl w-full"
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent position="popper">
                        <SelectItem value="L">L (7%)</SelectItem>
                        <SelectItem value="M">M (15%)</SelectItem>
                        <SelectItem value="Q">Q (25%)</SelectItem>
                        <SelectItem value="H">H (30%)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex flex-col gap-2 pt-2">
                  <Label className="text-sm font-bold flex items-center gap-2">
                    <Palette className="w-4 h-4" /> Personalización de Logo
                  </Label>
                  {!logo ? (
                    <LogoDnD onLogoChange={setLogo} />
                  ) : (
                    <div className="flex items-center gap-6 p-2 border rounded-xl bg-gray-50/10">
                      <div className="relative">
                        <img
                          src={logo}
                          alt="Logo"
                          className="h-20 w-20 object-contain bg-white border rounded-xl p-1"
                        />
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                          onClick={() => setLogo(null)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                      <div className="flex-1 space-y-4">
                        <div className="flex justify-between text-xs font-bold">
                          <span>Tamaño del Logo</span>
                          <span>{logoSize}px</span>
                        </div>
                        <Slider
                          value={[logoSize]}
                          min={20}
                          max={100}
                          onValueChange={(v) => setLogoSize(v[0])}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Tabs>
      </div>

      {/* COLUMNA DERECHA: PREVIEW FIJO */}

      <div
        style={{ background: background, color: text }}
        className={`gap-2 shadow-2xl   text-white flex flex-col py-4 h-full rounded-xl `}
      >
        <div className="w-full h-full flex flex-col items-center gap-4 ">
          <div className="text-xl font-bold text-center">Vista Previa</div>
          <div className="w-full flex flex-col h-full items-center justify-center gap-8">
            <QRCodeSVG
              id="qr-svg"
              value={qrValue || " "}
              className="w-64 h-64 2xl:w-80 2xl:h-80 object-contain  p-4"
              marginSize={1}
              fgColor={fgColor}
              bgColor={bgColor}
              level={level}
              imageSettings={
                logo
                  ? {
                      src: logo,
                      height: logoSize,
                      width: logoSize,
                      excavate: true,
                    }
                  : undefined
              }
            />

            <div className="  w-full flex flex-col items-center gap-2">
              <div className="w-3/4 flex flex-col gap-2">
                <Button
                  size="lg"
                  className="w-full h-14 text-lg font-bold rounded-2xl bg-green-600 hover:bg-green-500"
                  onClick={() => downloadQR("png")}
                >
                  <Download className="mr-2 w-5 h-5 font-bold" /> Descargar PNG
                </Button>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="secondary"
                    className="rounded-xl h-12"
                    onClick={() => downloadQR("svg")}
                  >
                    SVG
                  </Button>
                  <Button
                    variant="secondary"
                    className="rounded-xl h-12"
                    onClick={() => downloadQR("webp")}
                  >
                    WebP
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
