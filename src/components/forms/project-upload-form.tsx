"use client";

import * as React from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import {
  Loader2,
  AlertCircle,
  CheckCircle2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { UploadDropzone, type UploadFile } from "./upload-dropzone";
import { services } from "@/data/services";
import { slugify } from "@/lib/utils";
import { SERVICE_TYPES } from "@/lib/leads/schema";
import { PROJECT_CATEGORY_SUGGESTIONS } from "@/lib/projects/schema";
import {
  createProject,
  updateProject,
} from "@/app/dashboard/projects/actions";

const schema = z.object({
  title: z.string().min(3, "Add a project title"),
  slug: z
    .string()
    .min(3)
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must be kebab-case (lowercase, hyphens)"
    ),
  city: z.string().min(2, "City is required"),
  service_type: z.enum(SERVICE_TYPES),
  category: z.string().max(120).optional(),
  description: z.string().min(20, "Add a longer description (20+ chars)"),
  short_description: z
    .string()
    .max(280, "Keep the short description under 280 characters")
    .optional(),
  featured: z.boolean().optional(),
  sort_order: z
    .number({ message: "Sort order must be a number" })
    .int()
    .min(0)
    .max(9999)
    .optional(),
  youtube_url: z.string().max(500).optional(),
});

type FormValues = z.infer<typeof schema>;

export interface ProjectFormInitialValues {
  id: string;
  title: string;
  slug: string;
  city: string;
  service_type: FormValues["service_type"];
  category?: string | null;
  description: string;
  short_description?: string | null;
  featured: boolean;
  sort_order?: number | null;
  youtube_url?: string | null;
  cover_image_url?: string | null;
  before_images?: string[];
  after_images?: string[];
}

interface ProjectUploadFormProps {
  /** Pass an existing project to edit. Omit to create a new one. */
  initial?: ProjectFormInitialValues;
  /** Where to send the user after a successful save. */
  redirectTo?: string;
}

export function ProjectUploadForm({
  initial,
  redirectTo,
}: ProjectUploadFormProps = {}) {
  const isEdit = Boolean(initial);
  const router = useRouter();
  const [before, setBefore] = React.useState<UploadFile[]>([]);
  const [after, setAfter] = React.useState<UploadFile[]>([]);
  const [cover, setCover] = React.useState<UploadFile[]>([]);
  const [replaceBefore, setReplaceBefore] = React.useState(false);
  const [replaceAfter, setReplaceAfter] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [feedback, setFeedback] = React.useState<
    { kind: "ok" } | { kind: "error"; message: string } | null
  >(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      service_type: initial?.service_type ?? "stucco",
      featured: initial?.featured ?? false,
      title: initial?.title ?? "",
      slug: initial?.slug ?? "",
      city: initial?.city ?? "",
      category: initial?.category ?? "",
      description: initial?.description ?? "",
      short_description: initial?.short_description ?? "",
      sort_order: initial?.sort_order ?? 0,
      youtube_url: initial?.youtube_url ?? "",
    },
  });

  const title = watch("title");

  // Auto-suggest a slug from the title — only on create.
  const userTouchedSlug = React.useRef(isEdit);
  React.useEffect(() => {
    if (!isEdit && !userTouchedSlug.current && title) {
      setValue("slug", slugify(title));
    }
  }, [title, setValue, isEdit]);

  async function onSubmit(values: FormValues) {
    setSubmitting(true);
    setFeedback(null);

    const fd = new FormData();
    fd.append("title", values.title);
    fd.append("slug", values.slug);
    fd.append("city", values.city);
    fd.append("service_type", values.service_type);
    if (values.category) fd.append("category", values.category);
    fd.append("description", values.description);
    if (values.short_description)
      fd.append("short_description", values.short_description);
    if (values.youtube_url) fd.append("youtube_url", values.youtube_url);
    if (values.featured) fd.append("featured", "on");
    fd.append("sort_order", String(values.sort_order ?? 0));
    if (cover[0]) fd.append("cover", cover[0].file, cover[0].file.name);
    for (const f of before) fd.append("before", f.file, f.file.name);
    for (const f of after) fd.append("after", f.file, f.file.name);
    if (replaceBefore) fd.append("replace_before", "on");
    if (replaceAfter) fd.append("replace_after", "on");

    try {
      const result = initial
        ? await updateProject(initial.id, fd)
        : await createProject(fd);
      if (!result.ok) {
        setFeedback({ kind: "error", message: result.error ?? "Could not save." });
        return;
      }
      setFeedback({ kind: "ok" });
      for (const f of [...cover, ...before, ...after]) {
        URL.revokeObjectURL(f.previewUrl);
      }
      setCover([]);
      setBefore([]);
      setAfter([]);
      setReplaceBefore(false);
      setReplaceAfter(false);
      if (!isEdit) {
        reset({ service_type: "stucco", featured: false, sort_order: 0 });
        userTouchedSlug.current = false;
      }
      if (redirectTo) {
        router.push(redirectTo);
        router.refresh();
      } else {
        router.refresh();
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="title">Project title</Label>
          <Input id="title" {...register("title")} />
          {errors.title ? (
            <p className="text-xs text-destructive">{errors.title.message}</p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            placeholder="Riverside, Corona, Eastvale…"
            {...register("city")}
          />
          {errors.city ? (
            <p className="text-xs text-destructive">{errors.city.message}</p>
          ) : null}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="slug">URL slug</Label>
        <Input
          id="slug"
          {...register("slug", {
            onChange: () => {
              userTouchedSlug.current = true;
            },
          })}
          placeholder="spanish-revival-stucco-restoration"
        />
        {errors.slug ? (
          <p className="text-xs text-destructive">{errors.slug.message}</p>
        ) : (
          <p className="text-xs text-muted-foreground">
            Used in the public URL: /projects/{watch("slug") || "your-slug"}
          </p>
        )}
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="service_type">Service type</Label>
          <Select id="service_type" {...register("service_type")}>
            {services.map((s) => (
              <option key={s.slug} value={s.type}>
                {s.title}
              </option>
            ))}
          </Select>
          <p className="text-xs text-muted-foreground">
            Controls which gallery filter the project lives under.
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Category / tag</Label>
          <Input
            id="category"
            list="project-category-suggestions"
            placeholder="Stucco Installation"
            {...register("category")}
          />
          <datalist id="project-category-suggestions">
            {PROJECT_CATEGORY_SUGGESTIONS.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
          {errors.category ? (
            <p className="text-xs text-destructive">{errors.category.message}</p>
          ) : (
            <p className="text-xs text-muted-foreground">
              Display label shown on cards.
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="short_description">
          Short description{" "}
          <span className="text-muted-foreground">
            (1-2 lines for cards · optional)
          </span>
        </Label>
        <Input
          id="short_description"
          placeholder="Hand-troweled smooth finish on a 1960s ranch."
          {...register("short_description")}
        />
        {errors.short_description ? (
          <p className="text-xs text-destructive">
            {errors.short_description.message}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Full description</Label>
        <Textarea id="description" rows={4} {...register("description")} />
        {errors.description ? (
          <p className="text-xs text-destructive">{errors.description.message}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="youtube_url">
          YouTube URL{" "}
          <span className="text-muted-foreground">(optional)</span>
        </Label>
        <Input
          id="youtube_url"
          type="url"
          inputMode="url"
          placeholder="https://www.youtube.com/watch?v=…"
          {...register("youtube_url")}
        />
        <p className="text-xs text-muted-foreground">
          Adds a play-icon badge on the project cover.
        </p>
      </div>

      <div className="space-y-2">
        <Label>
          Cover image
          {isEdit && initial?.cover_image_url ? (
            <span className="ml-2 text-xs text-muted-foreground">
              (upload to replace)
            </span>
          ) : null}
        </Label>
        {isEdit && initial?.cover_image_url ? (
          <div className="relative aspect-[16/9] w-full max-w-md overflow-hidden rounded-lg border border-border bg-surface-2">
            <Image
              src={initial.cover_image_url}
              alt={initial.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        ) : null}
        <UploadDropzone
          value={cover}
          onChange={setCover}
          max={1}
          label={
            isEdit && initial?.cover_image_url
              ? "Upload a new cover"
              : "Choose a cover image"
          }
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Before photos</Label>
          {isEdit && initial?.before_images?.length ? (
            <ExistingThumbs urls={initial.before_images} />
          ) : null}
          <UploadDropzone
            value={before}
            onChange={setBefore}
            max={8}
            label="Upload before photos"
          />
          {isEdit && initial?.before_images?.length ? (
            <label className="flex items-center gap-2 text-xs text-muted-foreground">
              <input
                type="checkbox"
                checked={replaceBefore}
                onChange={(e) => setReplaceBefore(e.target.checked)}
                className="h-3.5 w-3.5 rounded border-border bg-surface accent-[oklch(0.78_0.11_78)]"
              />
              Replace existing before photos (otherwise new uploads are appended)
            </label>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label>After photos</Label>
          {isEdit && initial?.after_images?.length ? (
            <ExistingThumbs urls={initial.after_images} />
          ) : null}
          <UploadDropzone
            value={after}
            onChange={setAfter}
            max={8}
            label="Upload after photos"
          />
          {isEdit && initial?.after_images?.length ? (
            <label className="flex items-center gap-2 text-xs text-muted-foreground">
              <input
                type="checkbox"
                checked={replaceAfter}
                onChange={(e) => setReplaceAfter(e.target.checked)}
                className="h-3.5 w-3.5 rounded border-border bg-surface accent-[oklch(0.78_0.11_78)]"
              />
              Replace existing after photos (otherwise new uploads are appended)
            </label>
          ) : null}
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <label className="flex items-center gap-2 text-sm text-foreground">
          <input
            type="checkbox"
            {...register("featured")}
            className="h-4 w-4 rounded border-border bg-surface accent-[oklch(0.78_0.11_78)]"
          />
          Mark as featured project
        </label>
        <div className="space-y-2">
          <Label htmlFor="sort_order">
            Sort order{" "}
            <span className="text-muted-foreground">
              (lower numbers appear first)
            </span>
          </Label>
          <Input
            id="sort_order"
            type="number"
            min={0}
            step={10}
            {...register("sort_order", { valueAsNumber: true })}
          />
          {errors.sort_order ? (
            <p className="text-xs text-destructive">
              {errors.sort_order.message}
            </p>
          ) : null}
        </div>
      </div>

      <div className="rounded-lg border border-border bg-surface/40 px-3.5 py-2.5 text-xs text-muted-foreground">
        Appears on:{" "}
        <span className="font-medium text-foreground">/projects</span> ·{" "}
        <span className="font-medium text-foreground">/gallery</span>
        {watch("featured") ? (
          <>
            {" "}· <span className="font-medium text-foreground">homepage</span>{" "}
            recent work
          </>
        ) : null}
      </div>

      {feedback?.kind === "error" ? (
        <div className="flex items-start gap-2 rounded-lg border border-destructive/40 bg-destructive/10 px-3.5 py-2.5 text-sm text-destructive">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <p>{feedback.message}</p>
        </div>
      ) : null}
      {feedback?.kind === "ok" ? (
        <div className="flex items-start gap-2 rounded-lg border border-emerald-400/30 bg-emerald-500/10 px-3.5 py-2.5 text-sm text-emerald-300">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          <p>
            {isEdit
              ? "Saved. Changes are live on the public site."
              : "Project saved and live on the public site."}
          </p>
        </div>
      ) : null}

      <div className="flex items-center gap-3">
        <Button
          type="submit"
          size="lg"
          disabled={submitting}
          className="shadow-[var(--shadow-glow)]"
        >
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {isEdit ? "Saving…" : "Publishing…"}
            </>
          ) : isEdit ? (
            "Save changes"
          ) : (
            "Publish project"
          )}
        </Button>
        {isEdit ? (
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={() => router.back()}
          >
            <X className="h-4 w-4" /> Cancel
          </Button>
        ) : null}
      </div>
    </form>
  );
}

function ExistingThumbs({ urls }: { urls: string[] }) {
  if (urls.length === 0) return null;
  return (
    <ul className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
      {urls.map((url) => (
        <li
          key={url}
          className="relative aspect-square overflow-hidden rounded-md border border-border bg-surface-2"
        >
          <Image
            src={url}
            alt="Existing project photo"
            fill
            sizes="120px"
            className="object-cover"
          />
        </li>
      ))}
    </ul>
  );
}
