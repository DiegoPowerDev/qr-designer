"use client";

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
} from "lucide-react";

// Shadcn UI
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogoDnD } from "./LogoDnD";

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
  const [wifiPass, setWifiPass] = useState("");
  const [wifiEncryption, setWifiEncryption] = useState("WPA");
  const [showPass, setShowPass] = useState(false);

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
    <div className="grid grid-cols-2 pt-8 w-3/4 justify-center gap-8">
      <div className="flex justify-center items-start">
        {/* COLUMNA IZQUIERDA: CONFIGURACIÓN */}

        <Tabs defaultValue="url" onValueChange={setMode} className="w-full">
          <TabsList className="grid w-full grid-cols-2 h-12 bg-slate-900 text-white rounded-xl ">
            <TabsTrigger value="url" className="rounded-lg">
              <LinkIcon className="w-4 h-4 mr-2" /> Enlace
            </TabsTrigger>
            <TabsTrigger value="wifi" className="rounded-lg">
              <Wifi className="w-4 h-4 mr-2" /> Wi-Fi
            </TabsTrigger>
          </TabsList>

          <Card className="border-none shadow-xl bg-slate-900 text-white backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl font-bold">
                <Settings2 className="w-6 h-6 text-primary" />
                Configuración
              </CardTitle>
            </CardHeader>
            <CardContent className=" ">
              <TabsContent value="url" className="flex flex-col gap-2 ">
                <div className="flex flex-col gap-2 ">
                  <Label
                    htmlFor="url"
                    className="font-bold flex items-center gap-2"
                  >
                    <Globe className="w-4 h-4" /> Enlace de destino
                  </Label>
                  <Input
                    id="url"
                    placeholder="https://tu-sitio.com"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="h-12 rounded-xl"
                  />
                </div>
              </TabsContent>

              <TabsContent value="wifi" className="flex flex-col gap-2">
                <div className=" flex flex-col gap-2">
                  <div className=" flex flex-col gap-2">
                    <Label htmlFor="ssid" className="font-bold">
                      Nombre de la Red (SSID)
                    </Label>
                    <Input
                      id="ssid"
                      placeholder="Ej: Starbucks_Guest"
                      value={wifiName}
                      onChange={(e) => setWifiName(e.target.value)}
                      className="h-9 rounded-xl"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <Label className="font-bold">Seguridad</Label>
                      <Select
                        value={wifiEncryption}
                        onValueChange={setWifiEncryption}
                      >
                        <SelectTrigger className="h-12 rounded-xl">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="WPA">WPA/WPA2</SelectItem>
                          <SelectItem value="WEP">WEP</SelectItem>
                          <SelectItem value="none">Abierta</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {wifiEncryption !== "none" && (
                      <div className="space-y-2">
                        <Label className="font-bold">Contraseña</Label>
                        <div className="relative">
                          <Input
                            type={showPass ? "text" : "password"}
                            value={wifiPass}
                            onChange={(e) => setWifiPass(e.target.value)}
                            className="h-9 rounded-xl "
                          />
                          <button
                            onClick={() => setShowPass(!showPass)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
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
              <div className="pt-4  ">
                <div className="flex w-full  justify-center gap-4 items-center">
                  <div className="flex flex-col gap-2 ">
                    <Label className="text-xs uppercase font-bold text-muted-foreground">
                      Color QR
                    </Label>
                    <div className="flex items-center px-2 bg-white rounded justify-center">
                      <input
                        type="color"
                        value={fgColor}
                        onChange={(e) => setFgColor(e.target.value)}
                        className="w-8 h-9 rounded-xl cursor-pointer border-none"
                      />
                      <span className="text-black">{fgColor}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 ">
                    <Label className="text-xs uppercase font-bold text-muted-foreground">
                      Fondo
                    </Label>
                    <div className="flex items-center px-2 gap-2 border rounded  bg-background">
                      <input
                        type="color"
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                        className="w-8 h-9 rounded-xl cursor-pointer border-none"
                      />
                      <span className="text-black">{bgColor}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 ">
                    <Label className="text-xs uppercase font-bold text-muted-foreground">
                      Redundancia
                    </Label>
                    <Select
                      value={level}
                      onValueChange={(v: any) => setLevel(v)}
                    >
                      <SelectTrigger className="h-9 rounded-xl w-full">
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

                <div className="space-y-4 pt-4">
                  <Label className="text-sm font-bold flex items-center gap-2">
                    <Palette className="w-4 h-4" /> Personalización de Logo
                  </Label>
                  {!logo ? (
                    <LogoDnD currentLogo={logo} onLogoChange={setLogo} />
                  ) : (
                    <div className="flex items-center gap-6 p-6 border rounded-2xl bg-gray-50/50">
                      <div className="relative">
                        <img
                          src={logo}
                          alt="Logo"
                          className="w-20 h-20 object-contain bg-white border rounded-xl p-1"
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
            </CardContent>
          </Card>
        </Tabs>
      </div>

      {/* COLUMNA DERECHA: PREVIEW FIJO */}

      <Card className="border-none shadow-2xl h-full bg-slate-900 text-white  ">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Vista Previa</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-8">
          <div className="p-6 bg-white rounded-[2rem] shadow-2xl ring-8 ring-white/10">
            <QRCodeSVG
              id="qr-svg"
              value={qrValue || " "}
              size={260}
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
          </div>

          <div className="w-full grid grid-cols-1 gap-3">
            <Button
              size="lg"
              className="w-full h-14 text-lg font-bold rounded-2xl bg-blue-600 hover:bg-blue-500"
              onClick={() => downloadQR("png")}
            >
              <Download className="mr-2 w-5 h-5" /> Descargar PNG
            </Button>
            <div className="grid grid-cols-2 gap-3">
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
        </CardContent>
      </Card>
    </div>
  );
}
