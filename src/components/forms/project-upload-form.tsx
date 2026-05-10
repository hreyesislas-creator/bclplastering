"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { UploadDropzone, type UploadFile } from "./upload-dropzone";
import { services } from "@/data/services";
import { slugify } from "@/lib/utils";
import { SERVICE_TYPES } from "@/lib/leads/schema";
import { createProject } from "@/app/dashboard/projects/actions";

const schema = z.object({
  title: z.string().min(3, "Add a project title"),
  slug: z
    .string()
    .min(3)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be kebab-case (lowercase, hyphens)"),
  city: z.string().min(2, "City is required"),
  service_type: z.enum(SERVICE_TYPES),
  description: z.string().min(20, "Add a short description (20+ chars)"),
  featured: z.boolean().optional(),
});

type FormValues = z.infer<typeof schema>;

export function ProjectUploadForm() {
  const [before, setBefore] = React.useState<UploadFile[]>([]);
  const [after, setAfter] = React.useState<UploadFile[]>([]);
  const [cover, setCover] = React.useState<UploadFile[]>([]);
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
    defaultValues: { service_type: "stucco", featured: false },
  });

  const title = watch("title");

  // Auto-suggest a slug from the title until the user edits it manually.
  const userTouchedSlug = React.useRef(false);
  React.useEffect(() => {
    if (!userTouchedSlug.current && title) {
      setValue("slug", slugify(title));
    }
  }, [title, setValue]);

  async function onSubmit(values: FormValues) {
    setSubmitting(true);
    setFeedback(null);

    const fd = new FormData();
    fd.append("title", values.title);
    fd.append("slug", values.slug);
    fd.append("city", values.city);
    fd.append("service_type", values.service_type);
    fd.append("description", values.description);
    if (values.featured) fd.append("featured", "on");
    if (cover[0]) fd.append("cover", cover[0].file, cover[0].file.name);
    for (const f of before) fd.append("before", f.file, f.file.name);
    for (const f of after) fd.append("after", f.file, f.file.name);

    try {
      const result = await createProject(fd);
      if (!result.ok) {
        setFeedback({ kind: "error", message: result.error ?? "Could not save." });
        return;
      }
      setFeedback({ kind: "ok" });
      reset({ service_type: "stucco", featured: false });
      for (const f of [...cover, ...before, ...after]) {
        URL.revokeObjectURL(f.previewUrl);
      }
      setCover([]);
      setBefore([]);
      setAfter([]);
      userTouchedSlug.current = false;
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
          placeholder="riverside-stucco-restoration"
        />
        {errors.slug ? (
          <p className="text-xs text-destructive">{errors.slug.message}</p>
        ) : (
          <p className="text-xs text-muted-foreground">
            Used in the public URL: /projects/{watch("slug") || "your-slug"}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="service_type">Service</Label>
        <Select id="service_type" {...register("service_type")}>
          {services.map((s) => (
            <option key={s.slug} value={s.type}>
              {s.title}
            </option>
          ))}
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" rows={4} {...register("description")} />
        {errors.description ? (
          <p className="text-xs text-destructive">{errors.description.message}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label>Cover image</Label>
        <UploadDropzone
          value={cover}
          onChange={setCover}
          max={1}
          label="Choose a cover image"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Before photos</Label>
          <UploadDropzone
            value={before}
            onChange={setBefore}
            max={8}
            label="Upload before photos"
          />
        </div>
        <div className="space-y-2">
          <Label>After photos</Label>
          <UploadDropzone
            value={after}
            onChange={setAfter}
            max={8}
            label="Upload after photos"
          />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-foreground">
        <input
          type="checkbox"
          {...register("featured")}
          className="h-4 w-4 rounded border-border bg-surface accent-[oklch(0.78_0.11_78)]"
        />
        Mark as featured project
      </label>

      {feedback?.kind === "error" ? (
        <div className="flex items-start gap-2 rounded-lg border border-destructive/40 bg-destructive/10 px-3.5 py-2.5 text-sm text-destructive">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <p>{feedback.message}</p>
        </div>
      ) : null}
      {feedback?.kind === "ok" ? (
        <div className="flex items-start gap-2 rounded-lg border border-emerald-400/30 bg-emerald-500/10 px-3.5 py-2.5 text-sm text-emerald-300">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          <p>Project saved and live on the public site.</p>
        </div>
      ) : null}

      <Button
        type="submit"
        size="lg"
        disabled={submitting}
        className="shadow-[var(--shadow-glow)]"
      >
        {submitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Publishing…
          </>
        ) : (
          "Publish project"
        )}
      </Button>
    </form>
  );
}
