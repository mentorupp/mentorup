"use client";

import { Camera, ImagePlus, Loader2, Trash2, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ACCEPTED_IMAGE_INPUT,
  MAX_IMAGE_BYTES,
  MAX_IMAGES,
  isAcceptedImageFile,
} from "@/lib/image-upload-formats";
import { cn } from "@/lib/utils";

export type CapturedImage = {
  id: string;
  file: File;
  previewUrl: string;
};

interface ImageCaptureUploadProps {
  images: CapturedImage[];
  onChange: (images: CapturedImage[]) => void;
  onError?: (message: string) => void;
  disabled?: boolean;
  className?: string;
}

function makeId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export default function ImageCaptureUpload({
  images,
  onChange,
  onError,
  disabled,
  className,
}: ImageCaptureUploadProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const cameraFileRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraLoading, setCameraLoading] = useState(false);

  const revokeAll = useCallback((list: CapturedImage[]) => {
    list.forEach((img) => URL.revokeObjectURL(img.previewUrl));
  }, []);

  useEffect(() => {
    return () => {
      revokeAll(images);
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, [images, revokeAll]);

  const addFiles = (files: FileList | File[]) => {
    onError?.("");
    const incoming = Array.from(files);

    if (images.length + incoming.length > MAX_IMAGES) {
      onError?.(`Envie no máximo ${MAX_IMAGES} imagens por vez.`);
      return;
    }

    const next: CapturedImage[] = [];

    for (const file of incoming) {
      if (!isAcceptedImageFile(file)) {
        onError?.("Formato inválido. Use JPG, PNG ou WEBP.");
        continue;
      }
      if (file.size > MAX_IMAGE_BYTES) {
        onError?.("Imagem muito grande. Máximo 8 MB por foto.");
        continue;
      }
      next.push({
        id: makeId(),
        file,
        previewUrl: URL.createObjectURL(file),
      });
    }

    if (next.length > 0) {
      onChange([...images, ...next]);
    }
  };

  const removeImage = (id: string) => {
    const target = images.find((img) => img.id === id);
    if (target) URL.revokeObjectURL(target.previewUrl);
    onChange(images.filter((img) => img.id !== id));
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setCameraOpen(false);
  };

  const startCamera = async () => {
    onError?.("");
    setCameraLoading(true);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
        audio: false,
      });
      streamRef.current = stream;
      setCameraOpen(true);

      requestAnimationFrame(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          void videoRef.current.play();
        }
      });
    } catch {
      onError?.(
        "Não foi possível abrir a câmera. Use “Enviar imagem” ou permita acesso à câmera no navegador."
      );
    } finally {
      setCameraLoading(false);
    }
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    if (!video || !video.videoWidth) return;

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0);
    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const file = new File([blob], `prova-${Date.now()}.jpg`, { type: "image/jpeg" });
        addFiles([file]);
        stopCamera();
      },
      "image/jpeg",
      0.95
    );
  };

  return (
    <div className={cn("space-y-3", className)}>
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          disabled={disabled || cameraLoading || images.length >= MAX_IMAGES}
          onClick={() => void startCamera()}
          className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-surface-200 bg-surface-50 py-5 text-sm font-medium text-zinc-700 transition hover:border-primary-300 hover:bg-primary-50/40 disabled:opacity-50"
        >
          {cameraLoading ? (
            <Loader2 size={22} className="animate-spin text-primary-500" />
          ) : (
            <Camera size={22} className="text-primary-500" />
          )}
          <span className="mt-2">Tirar foto</span>
        </button>

        <button
          type="button"
          disabled={disabled || images.length >= MAX_IMAGES}
          onClick={() => fileRef.current?.click()}
          className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-surface-200 bg-surface-50 py-5 text-sm font-medium text-zinc-700 transition hover:border-primary-300 hover:bg-primary-50/40 disabled:opacity-50"
        >
          <ImagePlus size={22} className="text-primary-500" />
          <span className="mt-2">Enviar imagem</span>
        </button>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept={ACCEPTED_IMAGE_INPUT}
        multiple
        className="hidden"
        disabled={disabled}
        onChange={(e) => {
          if (e.target.files?.length) addFiles(e.target.files);
          e.target.value = "";
        }}
      />

      <input
        ref={cameraFileRef}
        type="file"
        accept={ACCEPTED_IMAGE_INPUT}
        capture="environment"
        className="hidden"
        disabled={disabled}
        onChange={(e) => {
          if (e.target.files?.length) addFiles(e.target.files);
          e.target.value = "";
        }}
      />

      {cameraOpen && (
        <div className="overflow-hidden rounded-xl border border-surface-200 bg-black">
          <div className="flex items-center justify-between bg-zinc-900 px-3 py-2 text-xs text-white">
            <span>Enquadre a prova inteira — toque para focar</span>
            <button type="button" onClick={stopCamera} aria-label="Fechar câmera">
              <X size={16} />
            </button>
          </div>
          <video ref={videoRef} className="aspect-[4/3] w-full object-cover" playsInline muted />
          <div className="flex gap-2 bg-zinc-900 p-3">
            <button
              type="button"
              onClick={capturePhoto}
              className="flex-1 rounded-lg bg-primary-500 py-2 text-sm font-semibold text-white"
            >
              Capturar
            </button>
            <button
              type="button"
              onClick={stopCamera}
              className="rounded-lg border border-zinc-600 px-4 py-2 text-sm text-white"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {images.map((img) => (
            <div key={img.id} className="group relative overflow-hidden rounded-lg border border-surface-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.previewUrl} alt="Página da prova" className="aspect-[3/4] w-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(img.id)}
                disabled={disabled}
                className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white opacity-90 hover:bg-black"
                aria-label="Remover imagem"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      <p className="text-center text-[11px] leading-relaxed text-zinc-400">
        JPG, PNG ou WEBP — até {MAX_IMAGES} fotos, 8 MB cada. Enquadre a página inteira, luz
        uniforme, celular paralelo ao papel e toque na tela para focar antes de capturar.
      </p>
    </div>
  );
}
