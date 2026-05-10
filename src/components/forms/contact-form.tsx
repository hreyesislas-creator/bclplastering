"use client";

import * as React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  CheckCircle2,
  Loader2,
  Camera,
  ArrowRight,
  AlertCircle,
  MessageCircle,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { UploadDropzone, type UploadFile } from "./upload-dropzone";
import { services } from "@/data/services";
import { formatPhone, cn } from "@/lib/utils";
import { site } from "@/lib/site";
import { SERVICE_TYPES } from "@/lib/leads/schema";
import { trackEvent, trackWhatsApp, trackPhone } from "@/lib/analytics/events";

const schema = z.object({
  full_name: z.string().min(2, "Please enter your full name"),
  phone: z.string().min(10, "Enter a valid phone number"),
  email: z.string().email("Enter a valid email").optional().or(z.literal("")),
  city: z.string().min(2, "City is required"),
  service_type: z.enum(SERVICE_TYPES),
  message: z.string().max(2000).optional().or(z.literal("")),
});

type FormValues = z.infer<typeof schema>;

type SubmitState =
  | { kind: "idle" }
  | { kind: "submitting"; progress: number; phase: "uploading" | "saving" }
  | { kind: "error"; message: string }
  | { kind: "success"; id: string };

export function ContactForm() {
  const [uploads, setUploads] = React.useState<UploadFile[]>([]);
  const [state, setState] = React.useState<SubmitState>({ kind: "idle" });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { service_type: "stucco" },
  });

  const isSubmitting = state.kind === "submitting";

  const onSubmit = (values: FormValues) => {
    const fd = new FormData();
    fd.append("full_name", values.full_name);
    fd.append("phone", values.phone);
    fd.append("email", values.email ?? "");
    fd.append("city", values.city);
    fd.append("service_type", values.service_type);
    fd.append("message", values.message ?? "");
    for (const f of uploads) {
      fd.append("photos", f.file, f.file.name);
    }

    // XHR is intentional — fetch in browsers does not surface upload
    // progress events, but XHR does.
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/leads");

    setState({ kind: "submitting", progress: 0, phase: "uploading" });

    xhr.upload.addEventListener("progress", (e) => {
      if (!e.lengthComputable) return;
      const pct = Math.round((e.loaded / e.total) * 100);
      setState({
        kind: "submitting",
        progress: pct,
        phase: pct < 100 ? "uploading" : "saving",
      });
    });

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const body = JSON.parse(xhr.responseText) as { id: string };
          setState({ kind: "success", id: body.id });
          trackEvent("lead_submit", {
            source: "contact_form",
            meta: {
              service: values.service_type,
              with_photos: uploads.length > 0,
              photo_count: uploads.length,
            },
          });
          for (const f of uploads) URL.revokeObjectURL(f.previewUrl);
          setUploads([]);
          reset({ service_type: "stucco" });
        } catch {
          setState({ kind: "success", id: "" });
          trackEvent("lead_submit", { source: "contact_form" });
        }
        return;
      }
      try {
        const body = JSON.parse(xhr.responseText) as { error?: string };
        setState({
          kind: "error",
          message: body.error || "Something went wrong. Please try again.",
        });
        trackEvent("lead_submit_failed", { source: "contact_form" });
      } catch {
        setState({
          kind: "error",
          message: "Something went wrong. Please try again.",
        });
        trackEvent("lead_submit_failed", { source: "contact_form" });
      }
    };

    xhr.onerror = () =>
      setState({
        kind: "error",
        message:
          "Network error — please check your connection and try again.",
      });

    xhr.send(fd);
  };

  if (state.kind === "success") {
    return <SuccessState onAgain={() => setState({ kind: "idle" })} />;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Full name" htmlFor="full_name" error={errors.full_name?.message}>
          <Input id="full_name" autoComplete="name" {...register("full_name")} />
        </Field>
        <Field label="Phone" htmlFor="phone" error={errors.phone?.message}>
          <Input
            id="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="(951) 555-0123"
            {...register("phone", {
              onChange: (e) => setValue("phone", formatPhone(e.target.value)),
            })}
          />
        </Field>
        <Field label="Email (optional)" htmlFor="email" error={errors.email?.message}>
          <Input
            id="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            {...register("email")}
          />
        </Field>
        <Field label="City" htmlFor="city" error={errors.city?.message}>
          <Input
            id="city"
            autoComplete="address-level2"
            placeholder="Riverside, Corona, Eastvale…"
            {...register("city")}
          />
        </Field>
      </div>

      <Field
        label="What do you need?"
        htmlFor="service_type"
        error={errors.service_type?.message}
      >
        <Select id="service_type" {...register("service_type")}>
          {services.map((s) => (
            <option key={s.slug} value={s.type}>
              {s.title}
            </option>
          ))}
          <option value="other">Something else</option>
        </Select>
      </Field>

      <Field label="Tell us about the project (optional)" htmlFor="message">
        <Textarea
          id="message"
          rows={4}
          placeholder="Square footage, finish you have in mind, timeline…"
          {...register("message")}
        />
      </Field>

      <div className="rounded-2xl border border-gold/30 bg-gradient-to-br from-gold/5 to-transparent p-5 sm:p-6 space-y-3">
        <div className="flex items-start gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-gold/15 text-gold">
            <Camera className="h-5 w-5" />
          </span>
          <div>
            <Label className="text-base text-foreground">
              Upload project photos for a faster estimate
            </Label>
            <p className="mt-1 text-xs text-muted-foreground">
              Snap a few from your phone — wide shots and close-ups of the
              areas you want addressed. We can usually quote 70% of the work
              before we even arrive.
            </p>
          </div>
        </div>
        <UploadDropzone
          value={uploads}
          onChange={setUploads}
          disabled={isSubmitting}
        />
      </div>

      {state.kind === "error" ? (
        <div className="flex items-start gap-3 rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <p>{state.message}</p>
        </div>
      ) : null}

      {isSubmitting ? (
        <div
          role="status"
          aria-live="polite"
          className="rounded-xl border border-border bg-surface px-4 py-3 text-sm"
        >
          <div className="flex items-center justify-between gap-3">
            <span className="inline-flex items-center gap-2 text-foreground">
              <Loader2 className="h-4 w-4 animate-spin text-gold" />
              {state.phase === "uploading"
                ? uploads.length > 0
                  ? `Uploading ${uploads.length} photo${uploads.length === 1 ? "" : "s"}…`
                  : "Sending your request…"
                : "Saving your request…"}
            </span>
            <span className="font-mono text-xs text-muted-foreground">
              {state.progress}%
            </span>
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
            <div
              className="h-full rounded-full bg-gold transition-[width] duration-200 ease-out"
              style={{ width: `${state.progress}%` }}
            />
          </div>
        </div>
      ) : null}

      <Button
        type="submit"
        size="xl"
        disabled={isSubmitting}
        className={cn("w-full sm:w-auto shadow-[var(--shadow-glow)]")}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Submitting…
          </>
        ) : (
          <>
            Request my free estimate <ArrowRight className="h-4 w-4" />
          </>
        )}
      </Button>

      <p className="text-xs text-muted-foreground">
        By submitting, you agree to be contacted by BCL Plastering about your
        project. We never share your information.
      </p>
    </form>
  );
}

function SuccessState({ onAgain }: { onAgain: () => void }) {
  return (
    <div className="rounded-2xl border border-gold/30 bg-gradient-to-br from-gold/5 to-transparent p-8 sm:p-10 text-center">
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-gold/40 to-gold/5 text-gold ring-1 ring-gold/40">
        <CheckCircle2 className="h-7 w-7" />
      </div>
      <h3 className="font-display text-2xl sm:text-3xl mt-5 text-foreground">
        Got it — we&apos;ll review your project shortly.
      </h3>
      <p className="mt-3 text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
        A project manager will reach out within {site.responseWindow} to
        schedule your free on-site estimate. Want a faster reply? Send us a
        photo on WhatsApp and we&apos;ll respond within the hour.
      </p>

      <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3">
        <Button asChild size="lg">
          <Link
            href={site.whatsapp}
            target="_blank"
            rel="noreferrer"
            className="!text-gold-foreground"
            onClick={() => trackWhatsApp("post_submit")}
          >
            <MessageCircle className="h-4 w-4" />
            Continue on WhatsApp
          </Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <a href={site.phoneHref} onClick={() => trackPhone("post_submit")}>
            <Phone className="h-4 w-4" />
            Call {site.phone}
          </a>
        </Button>
      </div>

      <button
        type="button"
        onClick={onAgain}
        className="mt-6 text-xs text-muted-foreground hover:text-foreground underline-offset-2 hover:underline"
      >
        Submit another request
      </button>
    </div>
  );
}

function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}
