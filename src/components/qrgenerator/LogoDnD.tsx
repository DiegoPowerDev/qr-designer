"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, AlertCircle } from "lucide-react";

interface LogoUploadProps {
  onLogoChange: (url: string | null) => void;
}

export function LogoDnD({ onLogoChange }: LogoUploadProps) {
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
      <div
        {...getRootProps()}
        className={`
            relative border-2 border-dashed rounded-2xl p-2 transition-all duration-200 cursor-pointer
            flex flex-col items-center justify-center text-center
            ${
              isDragActive
                ? "border-blue-500 bg-blue-50/50 scale-[1.02]"
                : "border-gray-200 hover:border-gray-300 hover:bg-gray-50/20 hover:text-black"
            }
          `}
      >
        <input
          id="logo-upload-input"
          aria-label="Subir logo para el código QR"
          {...getInputProps()}
        />
        <div className="p-4 bg-white rounded-full shadow-sm mb-2">
          <Upload
            className={`w-6 h-6 ${isDragActive ? "text-blue-500" : "text-gray-400"}`}
          />
        </div>

        <div className="space-y-1">
          <p className="text-sm font-semibold  ">
            {isDragActive ? "¡Suéltalo el logo aqui!" : "Arrastra tu logo aquí"}
          </p>
          <p className="text-xs ">PNG, JPG, WEBP o SVG (Máx. 2MB)</p>
        </div>

        {error && (
          <div className="mt-4 flex items-center gap-2 text-red-500 text-xs font-medium">
            <AlertCircle size={14} />
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
