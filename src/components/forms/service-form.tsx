"use client";

import * as React from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { UploadDropzone, type UploadFile } from "./upload-dropzone";
import {
  SERVICE_CATEGORY_SUGGESTIONS,
  SERVICE_ICON_KEYS,
} from "@/lib/services/schema";
import { SERVICE_ICON_OPTIONS } from "@/components/sections/service-icon";
import { ServiceIcon } from "@/components/sections/service-icon";
import { slugify } from "@/lib/utils";
import {
  createService,
  updateService,
} from "@/app/dashboard/services/actions";

const schema = z.object({
  title: z.string().min(3, "Add a service title"),
  slug: z
    .string()
    .min(3)
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must be kebab-case (lowercase, hyphens)"
    ),
  category: z.string().max(120).optional(),
  short_description: z
    .string()
    .max(280, "Keep the short description under 280 characters")
    .optional(),
  description: z
    .string()
    .max(4000, "Keep the full description under 4000 characters")
    .optional(),
  price_label: z.string().max(80).optional(),
  icon_key: z.enum(SERVICE_ICON_KEYS).optional(),
  is_active: z.boolean().optional(),
  featured: z.boolean().optional(),
  sort_order: z
    .number({ message: "Sort order must be a number" })
    .int()
    .min(0)
    .max(9999)
    .optional(),
});

type FormValues = z.infer<typeof schema>;

export interface ServiceFormInitialValues {
  id: string;
  title: string;
  slug: string;
  category?: string | null;
  short_description?: string | null;
  description?: string | null;
  bullets: string[];
  price_label?: string | null;
  icon_key?: string | null;
  image_url?: string | null;
  is_active: boolean;
  featured: boolean;
  sort_order: number;
}

interface ServiceFormProps {
  initial?: ServiceFormInitialValues;
  redirectTo?: string;
}

export function ServiceForm({ initial, redirectTo }: ServiceFormProps = {}) {
  const isEdit = Boolean(initial);
  const router = useRouter();

  const [bullets, setBullets] = React.useState<string[]>(
    initial?.bullets?.length ? [...initial.bullets] : [""]
  );
  const [image, setImage] = React.useState<UploadFile[]>([]);
  const [submitting, setSubmitting] = React.useState(false);
  const [feedback, setFeedback] = React.useState<
    { kind: "ok" } | { kind: "error"; message: string } | null
  >(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: initial?.title ?? "",
      slug: initial?.slug ?? "",
      category: initial?.category ?? "",
      short_description: initial?.short_description ?? "",
      description: initial?.description ?? "",
      price_label: initial?.price_label ?? "",
      icon_key:
        (initial?.icon_key as FormValues["icon_key"]) ?? "sparkles",
      is_active: initial?.is_active ?? true,
      featured: initial?.featured ?? true,
      sort_order: initial?.sort_order ?? 0,
    },
  });

  const title = watch("title");
  const iconKey = watch("icon_key");
  const userTouchedSlug = React.useRef(isEdit);

  React.useEffect(() => {
    if (!isEdit && !userTouchedSlug.current && title) {
      setValue("slug", slugify(title));
    }
  }, [title, setValue, isEdit]);

  function updateBullet(i: number, value: string) {
    setBullets((prev) => prev.map((b, idx) => (idx === i ? value : b)));
  }
  function addBullet() {
    setBullets((prev) => [...prev, ""]);
  }
  function removeBullet(i: number) {
    setBullets((prev) => prev.filter((_, idx) => idx !== i));
  }

  async function onSubmit(values: FormValues) {
    setSubmitting(true);
    setFeedback(null);

    const fd = new FormData();
    fd.append("title", values.title);
    fd.append("slug", values.slug);
    if (values.category) fd.append("category", values.category);
    if (values.short_description)
      fd.append("short_description", values.short_description);
    if (values.description) fd.append("description", values.description);
    if (values.price_label) fd.append("price_label", values.price_label);
    if (values.icon_key) fd.append("icon_key", values.icon_key);
    fd.append("sort_order", String(values.sort_order ?? 0));
    if (values.is_active ?? true) fd.append("is_active", "on");
    if (values.featured ?? true) fd.append("featured", "on");
    bullets
      .map((b) => b.trim())
      .filter((b) => b.length > 0)
      .forEach((b) => fd.append("bullets", b));
    if (image[0]) fd.append("image", image[0].file, image[0].file.name);

    try {
      const res = initial
        ? await updateService(initial.id, fd)
        : await createService(fd);
      if (!res.ok) {
        setFeedback({ kind: "error", message: res.error ?? "Could not save." });
        return;
      }
      setFeedback({ kind: "ok" });
      for (const f of image) URL.revokeObjectURL(f.previewUrl);
      setImage([]);
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
          <Label htmlFor="title">Title</Label>
          <Input id="title" {...register("title")} />
          {errors.title ? (
            <p className="text-xs text-destructive">{errors.title.message}</p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Input
            id="category"
            list="service-category-suggestions"
            placeholder="Stucco"
            {...register("category")}
          />
          <datalist id="service-category-suggestions">
            {SERVICE_CATEGORY_SUGGESTIONS.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
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
          placeholder="stucco-installation"
        />
        {errors.slug ? (
          <p className="text-xs text-destructive">{errors.slug.message}</p>
        ) : (
          <p className="text-xs text-muted-foreground">
            Public URL: /services/{watch("slug") || "your-slug"}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="short_description">
          Short description{" "}
          <span className="text-muted-foreground">
            (shown on cards · 1–2 lines)
          </span>
        </Label>
        <Input
          id="short_description"
          placeholder="Hand-applied California stucco — smooth, sand, lace, and Santa Barbara finishes."
          {...register("short_description")}
        />
        {errors.short_description ? (
          <p className="text-xs text-destructive">
            {errors.short_description.message}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">
          Full description{" "}
          <span className="text-muted-foreground">
            (shown on /services/[slug])
          </span>
        </Label>
        <Textarea id="description" rows={5} {...register("description")} />
        {errors.description ? (
          <p className="text-xs text-destructive">
            {errors.description.message}
          </p>
        ) : null}
      </div>

      {/* Bullets */}
      <div className="space-y-2">
        <Label>Bullets</Label>
        <ul className="space-y-2">
          {bullets.map((b, i) => (
            <li key={i} className="flex items-center gap-2">
              <Input
                value={b}
                onChange={(e) => updateBullet(i, e.target.value)}
                placeholder={`Bullet ${i + 1}`}
              />
              <button
                type="button"
                onClick={() => removeBullet(i)}
                aria-label={`Remove bullet ${i + 1}`}
                className="grid h-9 w-9 shrink-0 place-items-center rounded-md border border-border bg-surface-2 text-muted-foreground hover:text-destructive transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
        </ul>
        <Button type="button" variant="outline" size="sm" onClick={addBullet}>
          <Plus className="h-3.5 w-3.5" /> Add bullet
        </Button>
        <p className="text-xs text-muted-foreground">
          The first 3 appear on the public card; up to 12 supported on the
          detail page.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="price_label">
            Price label{" "}
            <span className="text-muted-foreground">(optional)</span>
          </Label>
          <Input
            id="price_label"
            placeholder="From $8 / SQFT"
            {...register("price_label")}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="icon_key">Icon</Label>
          <div className="flex items-center gap-2">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md border border-border bg-surface-2 text-gold">
              <ServiceIcon
                iconKey={iconKey ?? "sparkles"}
                className="h-5 w-5"
              />
            </span>
            <Select id="icon_key" {...register("icon_key")} className="flex-1">
              {SERVICE_ICON_OPTIONS.map((opt) => (
                <option key={opt.key} value={opt.key}>
                  {opt.label}
                </option>
              ))}
            </Select>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label>
          Service image{" "}
          <span className="text-muted-foreground">
            (optional · shown on detail page)
          </span>
        </Label>
        {isEdit && initial?.image_url ? (
          <div className="relative aspect-[16/9] w-full max-w-md overflow-hidden rounded-lg border border-border bg-surface-2">
            <Image
              src={initial.image_url}
              alt={initial.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        ) : null}
        <UploadDropzone
          value={image}
          onChange={setImage}
          max={1}
          label={
            isEdit && initial?.image_url
              ? "Upload a replacement image"
              : "Choose an image"
          }
        />
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <label className="flex items-center gap-2 text-sm text-foreground">
          <input
            type="checkbox"
            {...register("is_active")}
            className="h-4 w-4 rounded border-border bg-surface accent-[oklch(0.78_0.11_78)]"
          />
          Active (visible publicly)
        </label>
        <label className="flex items-center gap-2 text-sm text-foreground">
          <input
            type="checkbox"
            {...register("featured")}
            className="h-4 w-4 rounded border-border bg-surface accent-[oklch(0.78_0.11_78)]"
          />
          Featured on homepage
        </label>
        <div className="space-y-2">
          <Label htmlFor="sort_order">
            Sort order{" "}
            <span className="text-muted-foreground">
              (lower = earlier)
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
        <span className="font-medium text-foreground">/services</span>{" "}
        {watch("is_active") ?? true ? null : <em>(inactive — hidden)</em>}
        {watch("featured") ?? true ? (
          <>
            {" "}· <span className="font-medium text-foreground">homepage</span>{" "}
            What we do
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
          <p>Saved. Changes are live on the public site.</p>
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
            "Publish service"
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
