"use client";

import { useState, ChangeEvent, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  Download,
  Upload,
  Trash2,
  Globe,
  Palette,
  Settings2,
  LinkIcon,
  Wifi,
  EyeOff,
  Eye,
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

export default function QrGenerator() {
  const [mode, setMode] = useState("url");
  const [value, setValue] = useState("https://diego-dev.com");
  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [level, setLevel] = useState<"L" | "M" | "Q" | "H">("H");
  const [logo, setLogo] = useState<string | null>(null);
  const [logoSize, setLogoSize] = useState(50);
  const [qrValue, setQrValue] = useState("");

  // Estados URL
  const [url, setUrl] = useState("https://");
  // Estados WIFI
  const [wifiName, setWifiName] = useState("");
  const [wifiPass, setWifiPass] = useState("");
  const [wifiEncryption, setWifiEncryption] = useState("WPA");
  const [showPass, setShowPass] = useState(false);

  const handleLogoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setLogo(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

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
    const url = URL.createObjectURL(svgBlob);

    if (format === "svg") {
      const link = document.createElement("a");
      link.href = url;
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
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };
  useEffect(() => {
    if (mode === "url") {
      setQrValue(url);
    } else {
      // Formato: WIFI:S:nombre;T:WPA;P:clave;;
      const encryption =
        wifiEncryption === "none" ? "" : `T:${wifiEncryption};`;
      const password = wifiEncryption === "none" ? "" : `P:${wifiPass};`;
      setQrValue(`WIFI:S:${wifiName};${encryption}${password};`);
    }
  }, [mode, url, wifiName, wifiPass, wifiEncryption]);
  return (
    <div className="container mx-auto py-10 px-4 max-w-6xl">
      <Tabs defaultValue="url" onValueChange={setMode} className="w-full">
        <TabsList className="grid w-full grid-cols-2 h-12 bg-gray-100 rounded-xl p-1">
          <TabsTrigger
            value="url"
            className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            <LinkIcon className="w-4 h-4 mr-2" /> Enlace
          </TabsTrigger>
          <TabsTrigger
            value="wifi"
            className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            <Wifi className="w-4 h-4 mr-2" /> Wi-Fi Negocio
          </TabsTrigger>
        </TabsList>
        <TabsContent value="url" className="pt-4 space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* PANEL DE CONFIGURACIÓN */}
            <div className="lg:col-span-7 space-y-6">
              <Card className="border-none shadow-xl bg-white/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl font-bold">
                    <Settings2 className="w-6 h-6 text-primary" />
                    Diseñador de QR
                  </CardTitle>
                  <CardDescription>
                    Configura el destino y la apariencia de tu código.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* INPUT URL */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="url"
                      className="text-sm font-bold flex items-center gap-2"
                    >
                      <Globe className="w-4 h-4" /> Enlace de destino
                    </Label>
                    <Input
                      id="url"
                      placeholder="https://tu-sitio-web.com"
                      value={qrValue}
                      onChange={(e) => setQrValue(e.target.value)}
                      className="h-12 text-lg rounded-xl transition-all focus-visible:ring-primary"
                    />
                  </div>

                  {/* COLORES Y NIVEL */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label className="text-xs uppercase tracking-wider font-bold text-muted-foreground">
                        Color QR
                      </Label>
                      <div className="flex items-center gap-2 p-2 border rounded-xl bg-background">
                        <input
                          type="color"
                          value={fgColor}
                          onChange={(e) => setFgColor(e.target.value)}
                          className="w-8 h-8 rounded-md border-none cursor-pointer"
                        />
                        <span className="text-xs font-mono">{fgColor}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs uppercase tracking-wider font-bold text-muted-foreground">
                        Fondo
                      </Label>
                      <div className="flex items-center gap-2 p-2 border rounded-xl bg-background">
                        <input
                          type="color"
                          value={bgColor}
                          onChange={(e) => setBgColor(e.target.value)}
                          className="w-8 h-8 rounded-md border-none cursor-pointer"
                        />
                        <span className="text-xs font-mono">{bgColor}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs uppercase tracking-wider font-bold text-muted-foreground">
                        Redundancia
                      </Label>
                      <Select
                        value={level}
                        onValueChange={(v: any) => setLevel(v)}
                      >
                        <SelectTrigger className="rounded-xl h-12">
                          <SelectValue placeholder="Nivel" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="L">7% (Baja)</SelectItem>
                          <SelectItem value="M">15% (Media)</SelectItem>
                          <SelectItem value="Q">25% (Alta)</SelectItem>
                          <SelectItem value="H">30% (Máxima)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* LOGO CUSTOMIZATION */}
                  <div className="space-y-4 pt-4 border-t">
                    <Label className="text-sm font-bold flex items-center gap-2">
                      <Palette className="w-4 h-4" /> Personalización de Logo
                    </Label>
                    <div className="flex flex-col sm:flex-row items-center gap-6 p-6 border-2 border-dashed rounded-2xl bg-gray-50/50">
                      {!logo ? (
                        <label className="flex flex-col items-center justify-center cursor-pointer group w-full">
                          <div className="p-3 bg-white rounded-full shadow-sm group-hover:scale-110 transition-transform">
                            <Upload className="w-6 h-6 text-primary" />
                          </div>
                          <span className="mt-2 text-sm font-medium text-gray-500">
                            Haz clic para subir logo
                          </span>
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleLogoUpload}
                          />
                        </label>
                      ) : (
                        <div className="w-full flex items-center gap-6">
                          <div className="relative group">
                            <img
                              src={logo}
                              alt="Logo"
                              className="w-16 h-16 object-contain p-1 bg-white border rounded-xl shadow-md"
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
                            <div className="flex justify-between text-xs font-bold text-muted-foreground">
                              <span>Tamaño del Logo</span>
                              <span>{logoSize}px</span>
                            </div>
                            <Slider
                              value={[logoSize]}
                              min={20}
                              max={100}
                              step={1}
                              onValueChange={(v) => setLogoSize(v[0])}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* PREVIEW Y DOWNLOADS */}
            <div className="lg:col-span-5 sticky top-8">
              <Card className="border-none shadow-2xl bg-slate-900 text-white overflow-hidden">
                <CardHeader className="text-center">
                  <CardTitle className="text-xl">Vista Previa</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center space-y-8">
                  <div className="p-6 bg-white rounded-[2rem] shadow-2xl ring-8 ring-white/10">
                    <QRCodeSVG
                      id="qr-svg"
                      value={qrValue}
                      size={260}
                      fgColor={fgColor}
                      bgColor={bgColor}
                      level={level}
                      includeMargin={true}
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

                  <div className="w-full grid grid-cols-1 gap-3 pt-4">
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
                        SVG Vector
                      </Button>
                      <Button
                        variant="secondary"
                        className="rounded-xl h-12"
                        onClick={() => downloadQR("webp")}
                      >
                        WebP Pro
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="wifi" className="pt-4 space-y-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="ssid">Nombre de la Red (SSID)</Label>
              <Input
                id="ssid"
                placeholder="Ej: Starbucks_Gratis"
                value={wifiName}
                onChange={(e) => setWifiName(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Seguridad</Label>
                <Select
                  value={wifiEncryption}
                  onValueChange={setWifiEncryption}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="WPA">WPA/WPA2 (Recomendado)</SelectItem>
                    <SelectItem value="WEP">WEP</SelectItem>
                    <SelectItem value="none">Abierta (Sin clave)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {wifiEncryption !== "none" && (
                <div className="space-y-2">
                  <Label htmlFor="pass">Contraseña</Label>
                  <div className="relative">
                    <Input
                      id="pass"
                      type={showPass ? "text" : "password"}
                      placeholder="••••••••"
                      value={wifiPass}
                      onChange={(e) => setWifiPass(e.target.value)}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="lg:col-span-5 sticky top-8">
            <Card className="border-none shadow-2xl bg-slate-900 text-white overflow-hidden">
              <CardHeader className="text-center">
                <CardTitle className="text-xl">Vista Previa</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center space-y-8">
                <div className="p-6 bg-white rounded-[2rem] shadow-2xl ring-8 ring-white/10">
                  <QRCodeSVG
                    id="qr-svg"
                    value={qrValue}
                    size={260}
                    fgColor={fgColor}
                    bgColor={bgColor}
                    level={level}
                    includeMargin={true}
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

                <div className="w-full grid grid-cols-1 gap-3 pt-4">
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
                      SVG Vector
                    </Button>
                    <Button
                      variant="secondary"
                      className="rounded-xl h-12"
                      onClick={() => downloadQR("webp")}
                    >
                      WebP Pro
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
