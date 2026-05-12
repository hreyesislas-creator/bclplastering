"use client";

import * as React from "react";
import Image from "next/image";
import {
  AlertCircle,
  CheckCircle2,
  ImagePlus,
  Loader2,
  PlayCircle,
  RotateCcw,
  Trash2,
  Video as VideoIcon,
} from "lucide-react";
import type { SiteImage } from "@/types/db";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { youtubeThumbnail } from "@/lib/site-images/youtube";
import { clearSiteImage, saveSiteImage } from "@/app/dashboard/images/actions";

const ACCEPTED = ["image/jpeg", "image/png", "image/webp"];
const MAX_BYTES = 8 * 1024 * 1024;

interface SiteImageCardProps {
  slot: SiteImage;
}

interface PendingFile {
  file: File;
  previewUrl: string;
}

export function SiteImageCard({ slot }: SiteImageCardProps) {
  const isVideo = slot.media_type === "youtube";
  const [pending, setPending] = React.useState<PendingFile | null>(null);
  const [altText, setAltText] = React.useState(slot.alt_text ?? "");
  const [youtubeInput, setYoutubeInput] = React.useState(slot.youtube_url ?? "");
  const [saving, startSave] = React.useTransition();
  const [clearing, startClear] = React.useTransition();
  const [feedback, setFeedback] = React.useState<
    { kind: "ok" } | { kind: "error"; message: string } | null
  >(null);
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const [dragOver, setDragOver] = React.useState(false);

  React.useEffect(() => {
    return () => {
      if (pending) URL.revokeObjectURL(pending.previewUrl);
    };
  }, [pending]);

  // Live preview embed url derived from the input field.
  const liveEmbed = React.useMemo(() => {
    if (!isVideo) return null;
    return previewEmbed(youtubeInput || slot.youtube_url || "");
  }, [isVideo, youtubeInput, slot.youtube_url]);

  const status = computeStatus(slot, !!pending, isVideo, youtubeInput);

  function handleFiles(files: FileList | File[]) {
    setFeedback(null);
    const file = Array.from(files)[0];
    if (!file) return;
    if (!ACCEPTED.includes(file.type)) {
      setFeedback({
        kind: "error",
        message: "Only JPG, PNG, or WEBP files are accepted.",
      });
      return;
    }
    if (file.size > MAX_BYTES) {
      setFeedback({ kind: "error", message: "Image must be under 8 MB." });
      return;
    }
    if (pending) URL.revokeObjectURL(pending.previewUrl);
    setPending({ file, previewUrl: URL.createObjectURL(file) });
  }

  function clearPending() {
    if (pending) URL.revokeObjectURL(pending.previewUrl);
    setPending(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFeedback(null);

    const fd = new FormData();
    fd.append("image_key", slot.image_key);
    fd.append("alt_text", altText);
    if (isVideo) fd.append("youtube_url", youtubeInput);
    if (pending) fd.append("file", pending.file, pending.file.name);

    startSave(async () => {
      const res = await saveSiteImage(fd);
      if (!res.ok) {
        setFeedback({
          kind: "error",
          message: res.error ?? "Could not save.",
        });
        return;
      }
      setFeedback({ kind: "ok" });
      clearPending();
    });
  }

  function onClear() {
    if (
      !confirm(
        isVideo
          ? "Unlink the YouTube video from this slot?"
          : "Remove the current image from this slot?"
      )
    )
      return;
    setFeedback(null);
    startClear(async () => {
      const res = await clearSiteImage(slot.image_key);
      if (!res.ok) {
        setFeedback({
          kind: "error",
          message: res.error ?? "Could not clear.",
        });
        return;
      }
      if (isVideo) setYoutubeInput("");
      clearPending();
      setFeedback({ kind: "ok" });
    });
  }

  return (
    <div className="flex flex-col rounded-2xl border border-border bg-surface overflow-hidden">
      {/* Preview */}
      <div className="relative aspect-[16/10] bg-surface-2 overflow-hidden">
        {isVideo ? (
          <VideoPreview
            embedUrl={liveEmbed}
            label={slot.label}
          />
        ) : (
          <ImagePreview
            pendingUrl={pending?.previewUrl ?? null}
            existingUrl={slot.image_url}
            altText={altText || slot.label}
            onDrop={handleFiles}
            dragOver={dragOver}
            setDragOver={setDragOver}
          />
        )}

        <div className="absolute top-3 left-3 flex items-center gap-2">
          <Badge variant={status.variant}>{status.label}</Badge>
          {isVideo ? (
            <Badge variant="outline" className="bg-background/70 backdrop-blur">
              <VideoIcon className="h-3 w-3" /> YouTube
            </Badge>
          ) : null}
        </div>
      </div>

      <form onSubmit={onSubmit} className="flex flex-1 flex-col gap-4 p-5">
        <header>
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-display text-base font-semibold leading-tight">
              {slot.label}
            </h3>
            <code className="rounded bg-surface-2 px-1.5 py-0.5 text-[10px] text-muted-foreground">
              {slot.image_key}
            </code>
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            {slot.page ? <span>{slot.page}</span> : null}
            {slot.section ? (
              <>
                <span aria-hidden>·</span>
                <span>{slot.section}</span>
              </>
            ) : null}
            {slot.recommended_width && slot.recommended_height ? (
              <>
                <span aria-hidden>·</span>
                <span>
                  {slot.recommended_width}×{slot.recommended_height}
                </span>
              </>
            ) : null}
          </div>
          {slot.description ? (
            <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
              {slot.description}
            </p>
          ) : null}
        </header>

        {isVideo ? (
          <div className="space-y-2">
            <Label htmlFor={`yt-${slot.image_key}`}>YouTube URL</Label>
            <Input
              id={`yt-${slot.image_key}`}
              type="url"
              inputMode="url"
              placeholder="https://www.youtube.com/watch?v=…"
              value={youtubeInput}
              onChange={(e) => setYoutubeInput(e.target.value)}
            />
            {youtubeInput && !liveEmbed ? (
              <p className="text-xs text-destructive">
                That URL doesn&apos;t look like a YouTube link.
              </p>
            ) : null}
          </div>
        ) : (
          <div className="space-y-2">
            <Label>Upload image</Label>
            <label
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                if (e.dataTransfer.files?.length) handleFiles(e.dataTransfer.files);
              }}
              className={cn(
                "flex cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-border bg-surface/40 px-4 py-5 text-center transition-colors hover:border-gold/50 hover:bg-surface",
                dragOver && "border-gold bg-surface"
              )}
            >
              <input
                ref={inputRef}
                type="file"
                className="sr-only"
                accept={ACCEPTED.join(",")}
                onChange={(e) => {
                  if (e.target.files?.length) handleFiles(e.target.files);
                }}
              />
              <ImagePlus className="h-5 w-5 text-gold" />
              <div className="mt-2 text-xs font-medium text-foreground">
                {pending
                  ? pending.file.name
                  : slot.image_url
                    ? "Replace image"
                    : "Choose or drop an image"}
              </div>
              <div className="mt-0.5 text-[11px] text-muted-foreground">
                JPG · PNG · WEBP · up to 8 MB
              </div>
            </label>
            {pending ? (
              <button
                type="button"
                onClick={clearPending}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Discard selection
              </button>
            ) : null}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor={`alt-${slot.image_key}`}>
            Alt text{" "}
            <span className="text-muted-foreground">(for accessibility)</span>
          </Label>
          <Input
            id={`alt-${slot.image_key}`}
            value={altText}
            onChange={(e) => setAltText(e.target.value)}
            placeholder={
              isVideo
                ? "Short description of this video"
                : "Describe what's in the photo"
            }
          />
        </div>

        {feedback?.kind === "error" ? (
          <div className="flex items-start gap-2 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive">
            <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <p>{feedback.message}</p>
          </div>
        ) : null}
        {feedback?.kind === "ok" ? (
          <div className="flex items-start gap-2 rounded-md border border-emerald-400/30 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-300">
            <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <p>Saved. Live on the public site.</p>
          </div>
        ) : null}

        <div className="mt-auto flex items-center justify-between gap-2 pt-2">
          {(slot.image_url || slot.youtube_embed_url) ? (
            <button
              type="button"
              onClick={onClear}
              disabled={clearing}
              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition-colors"
            >
              {clearing ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <Trash2 className="h-3 w-3" />
              )}
              {isVideo ? "Unlink video" : "Remove image"}
            </button>
          ) : (
            <span />
          )}
          <Button type="submit" size="sm" disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" /> Saving…
              </>
            ) : (
              <>
                <RotateCcw className="h-3.5 w-3.5" /> Save changes
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

/* -------- subcomponents -------- */

function ImagePreview({
  pendingUrl,
  existingUrl,
  altText,
  onDrop,
  dragOver,
  setDragOver,
}: {
  pendingUrl: string | null;
  existingUrl: string | null;
  altText: string;
  onDrop: (files: FileList) => void;
  dragOver: boolean;
  setDragOver: (v: boolean) => void;
}) {
  const src = pendingUrl ?? existingUrl;
  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        if (e.dataTransfer.files?.length) onDrop(e.dataTransfer.files);
      }}
      className={cn(
        "absolute inset-0",
        dragOver && "ring-2 ring-gold ring-inset"
      )}
    >
      {src ? (
        pendingUrl ? (
          // Local object URL — use <img> to skip next/image domain restrictions.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={altText}
            className="h-full w-full object-cover"
          />
        ) : (
          <Image
            src={src}
            alt={altText}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover"
          />
        )
      ) : (
        <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
          No image uploaded yet
        </div>
      )}
    </div>
  );
}

function VideoPreview({
  embedUrl,
  label,
}: {
  embedUrl: string | null;
  label: string;
}) {
  if (!embedUrl) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-xs text-muted-foreground">
        <PlayCircle className="h-7 w-7 text-gold" />
        <span>No YouTube video linked yet</span>
      </div>
    );
  }
  const thumb = youtubeThumbnail(embedUrl);
  return (
    <div className="absolute inset-0">
      {thumb ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={thumb} alt={label} className="h-full w-full object-cover" />
      ) : null}
      <div className="absolute inset-0 grid place-items-center bg-background/40">
        <a
          href={embedUrl.replace("/embed/", "/watch?v=")}
          target="_blank"
          rel="noreferrer"
          aria-label={`Open ${label} on YouTube`}
          className="grid h-12 w-12 place-items-center rounded-full bg-gold text-gold-foreground shadow-soft hover:bg-gold/90"
        >
          <PlayCircle className="h-6 w-6" />
        </a>
      </div>
    </div>
  );
}

function previewEmbed(raw: string): string | null {
  if (!raw) return null;
  // Lightweight client-side mirror of normalizeYoutubeUrl so the
  // preview updates instantly. The server still re-validates.
  if (/^[a-zA-Z0-9_-]{11}$/.test(raw.trim())) {
    return `https://www.youtube.com/embed/${raw.trim()}`;
  }
  try {
    const url = new URL(raw.trim());
    const host = url.hostname.replace(/^www\./, "").toLowerCase();
    if (host === "youtu.be") {
      const id = url.pathname.replace(/^\//, "").split(/[?&/]/)[0];
      return /^[a-zA-Z0-9_-]{11}$/.test(id)
        ? `https://www.youtube.com/embed/${id}`
        : null;
    }
    if (host === "youtube.com" || host === "m.youtube.com") {
      if (url.pathname === "/watch") {
        const id = url.searchParams.get("v") ?? "";
        return /^[a-zA-Z0-9_-]{11}$/.test(id)
          ? `https://www.youtube.com/embed/${id}`
          : null;
      }
      const m = url.pathname.match(
        /^\/(embed|shorts|live|v)\/([a-zA-Z0-9_-]{11})/
      );
      if (m) return `https://www.youtube.com/embed/${m[2]}`;
    }
  } catch {
    return null;
  }
  return null;
}

function computeStatus(
  slot: SiteImage,
  pendingFile: boolean,
  isVideo: boolean,
  youtubeInput: string
): { label: string; variant: "new" | "success" | "outline" | "destructive" } {
  if (pendingFile) return { label: "Ready to save", variant: "new" };
  if (isVideo) {
    if (slot.youtube_embed_url || youtubeInput.trim().length > 0)
      return { label: "Video Linked", variant: "success" };
    return { label: "Missing", variant: "outline" };
  }
  if (slot.image_url) return { label: "Uploaded", variant: "success" };
  return { label: "Missing", variant: "outline" };
}
