"use client";

import * as React from "react";
import { ImagePlus, X } from "lucide-react";
import { cn } from "@/lib/utils";

const MAX_BYTES = 8 * 1024 * 1024; // 8 MB per image
const ACCEPTED = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"];

export interface UploadFile {
  id: string;
  file: File;
  previewUrl: string;
}

interface UploadDropzoneProps {
  /** Currently selected files (controlled). */
  value: UploadFile[];
  /** Called whenever the selection changes. */
  onChange: (files: UploadFile[]) => void;
  /** Maximum number of files (default 6). */
  max?: number;
  className?: string;
  label?: string;
  disabled?: boolean;
}

export function UploadDropzone({
  value,
  onChange,
  max = 6,
  className,
  label = "Drop project photos or tap to upload",
  disabled = false,
}: UploadDropzoneProps) {
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const [dragOver, setDragOver] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const addFiles = React.useCallback(
    (incoming: FileList | File[]) => {
      setError(null);
      const list = Array.from(incoming);
      const next: UploadFile[] = [];
      for (const file of list) {
        if (!ACCEPTED.includes(file.type)) {
          setError("Only JPG, PNG, WEBP, or HEIC images are accepted.");
          continue;
        }
        if (file.size > MAX_BYTES) {
          setError("Each image must be under 8 MB.");
          continue;
        }
        next.push({
          id: crypto.randomUUID(),
          file,
          previewUrl: URL.createObjectURL(file),
        });
      }
      const merged = [...value, ...next].slice(0, max);
      onChange(merged);
    },
    [value, onChange, max]
  );

  const remove = (id: string) => {
    const target = value.find((f) => f.id === id);
    if (target) URL.revokeObjectURL(target.previewUrl);
    onChange(value.filter((f) => f.id !== id));
  };

  React.useEffect(() => {
    return () => {
      for (const f of value) URL.revokeObjectURL(f.previewUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={cn("space-y-3", className)}>
      <label
        onDragOver={(e) => {
          if (disabled) return;
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          if (disabled) return;
          e.preventDefault();
          setDragOver(false);
          if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files);
        }}
        className={cn(
          "relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-surface/40 px-6 py-10 text-center transition-colors",
          disabled
            ? "opacity-60 cursor-not-allowed"
            : "cursor-pointer hover:border-gold/50 hover:bg-surface",
          dragOver && !disabled && "border-gold bg-surface"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={ACCEPTED.join(",")}
          disabled={disabled}
          // mobile camera/gallery picker
          // capture="environment" is intentionally omitted so users can
          // also pick from the photo library on iOS/Android.
          className={cn(
            "absolute inset-0 opacity-0",
            disabled ? "cursor-not-allowed" : "cursor-pointer"
          )}
          onChange={(e) => {
            if (e.target.files?.length) addFiles(e.target.files);
            e.currentTarget.value = "";
          }}
        />
        <div className="grid h-12 w-12 place-items-center rounded-full bg-gold/15 text-gold">
          <ImagePlus className="h-5 w-5" />
        </div>
        <div className="mt-4 text-sm font-medium text-foreground">{label}</div>
        <div className="mt-1 text-xs text-muted-foreground">
          JPG, PNG, WEBP, HEIC · up to {max} photos · 8 MB each
        </div>
      </label>

      {error ? (
        <p className="text-xs text-destructive">{error}</p>
      ) : null}

      {value.length > 0 ? (
        <ul className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {value.map((f) => (
            <li
              key={f.id}
              className="relative aspect-square overflow-hidden rounded-md border border-border"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={f.previewUrl}
                alt={f.file.name}
                className="h-full w-full object-cover"
              />
              {disabled ? null : (
                <button
                  type="button"
                  onClick={() => remove(f.id)}
                  aria-label={`Remove ${f.file.name}`}
                  className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-background/80 text-foreground hover:bg-background"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
