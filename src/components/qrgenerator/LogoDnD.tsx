"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X, FileImage, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LogoUploadProps {
  onLogoChange: (url: string | null) => void;
  currentLogo: string | null;
}

export function LogoDnD({ onLogoChange, currentLogo }: LogoUploadProps) {
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setError(null);
      const file = acceptedFiles[0];

      if (file) {
        // Validar tamaño (ejemplo: max 2MB)
        if (file.size > 2 * 1024 * 1024) {
          setError("El archivo es demasiado grande (máx 2MB)");
          return;
        }

        const reader = new FileReader();
        reader.onload = () => {
          onLogoChange(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    },
    [onLogoChange],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/png": [".png"],
      "image/jpeg": [".jpg", ".jpeg"],
      "image/webp": [".webp"],
      "image/svg+xml": [".svg"],
    },
    multiple: false,
  });

  return (
    <div className="space-y-4 w-full">
      {!currentLogo ? (
        <div
          {...getRootProps()}
          className={`
            relative border-2 border-dashed rounded-2xl p-4 transition-all duration-200 cursor-pointer
            flex flex-col items-center justify-center text-center
            ${
              isDragActive
                ? "border-blue-500 bg-blue-50/50 scale-[1.02]"
                : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
            }
          `}
        >
          <input {...getInputProps()} />
          <div className="p-4 bg-white rounded-full shadow-sm mb-4">
            <Upload
              className={`w-6 h-6 ${isDragActive ? "text-blue-500" : "text-gray-400"}`}
            />
          </div>

          <div className="space-y-1">
            <p className="text-sm font-semibold text-gray-700">
              {isDragActive ? "¡Suéltalo ahora!" : "Arrastra tu logo aquí"}
            </p>
            <p className="text-xs text-gray-500">
              PNG, JPG, WEBP o SVG (Máx. 2MB)
            </p>
          </div>

          {error && (
            <div className="mt-4 flex items-center gap-2 text-red-500 text-xs font-medium">
              <AlertCircle size={14} />
              {error}
            </div>
          )}
        </div>
      ) : (
        <div className="relative group overflow-hidden rounded-2xl border bg-white p-4 flex items-center gap-4">
          <div className="h-16 w-16 relative bg-gray-50 rounded-lg flex items-center justify-center border overflow-hidden">
            <img
              src={currentLogo}
              alt="Preview"
              className="max-h-full max-w-full object-contain"
            />
          </div>

          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium text-gray-900 truncate">
              Logo cargado
            </p>
            <p className="text-xs text-gray-500">Listo para el QR</p>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => onLogoChange(null)}
            className="text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
          >
            <X size={18} />
          </Button>
        </div>
      )}
    </div>
  );
}
