"use client";

import { FileText, Loader2, Upload } from "lucide-react";
import { useRef, useState } from "react";
import {
  ACCEPTED_FILE_INPUT,
  UPLOAD_FORMAT_HINT,
  UPLOAD_FORMAT_LABEL,
} from "@/lib/upload-formats";
import { cn } from "@/lib/utils";

interface DocumentUploadZoneProps {
  onTextExtracted: (text: string, fileName: string) => void;
  onError?: (message: string) => void;
  disabled?: boolean;
  className?: string;
}

export default function DocumentUploadZone({
  onTextExtracted,
  onError,
  disabled,
  className,
}: DocumentUploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [loadedFile, setLoadedFile] = useState<string | null>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setLoadedFile(null);
    onError?.("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/documents/extract", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Erro ao ler arquivo");
      }

      onTextExtracted(data.text, data.fileName);
      setLoadedFile(data.fileName);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao processar arquivo";
      onError?.(message);
      setLoadedFile(null);
    } finally {
      setLoading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      <label
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-surface-200 bg-surface-50 py-7 transition-colors",
          disabled || loading
            ? "pointer-events-none opacity-60"
            : "hover:border-primary-300 hover:bg-primary-50/50"
        )}
      >
        {loading ? (
          <>
            <Loader2 size={24} className="animate-spin text-primary-500" />
            <span className="mt-2 text-sm font-medium text-primary-600">
              Lendo arquivo...
            </span>
          </>
        ) : (
          <>
            <Upload size={24} className="text-zinc-400" />
            <span className="mt-2 text-sm font-medium text-zinc-700">
              Enviar arquivo — {UPLOAD_FORMAT_LABEL}
            </span>
            <span className="mt-1 text-xs text-zinc-400">Até 15 MB</span>
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_FILE_INPUT}
          className="hidden"
          disabled={disabled || loading}
          onChange={handleFile}
        />
      </label>

      {loadedFile && !loading && (
        <p className="flex items-center gap-2 rounded-lg bg-accent-50 px-3 py-2 text-xs font-medium text-accent-800">
          <FileText size={14} />
          {loadedFile} carregado — revise o texto abaixo antes de gerar.
        </p>
      )}

      <p className="text-center text-[11px] leading-relaxed text-zinc-400">
        {UPLOAD_FORMAT_HINT}
      </p>
    </div>
  );
}
