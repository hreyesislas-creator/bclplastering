"use client";

import * as React from "react";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import type { SiteSettings } from "@/lib/settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updateSettings } from "@/app/dashboard/settings/actions";

interface SettingsFormProps {
  settings: SiteSettings;
}

export function SettingsForm({ settings }: SettingsFormProps) {
  const [pending, setPending] = React.useState(false);
  const [feedback, setFeedback] = React.useState<
    { kind: "ok" } | { kind: "error"; message: string } | null
  >(null);

  async function handleSubmit(formData: FormData) {
    setPending(true);
    setFeedback(null);
    try {
      const res = await updateSettings(formData);
      if (!res.ok) {
        setFeedback({ kind: "error", message: res.error ?? "Could not save." });
        return;
      }
      setFeedback({ kind: "ok" });
    } finally {
      setPending(false);
    }
  }

  return (
    <form action={handleSubmit} className="space-y-8">
      <section className="space-y-5">
        <h3 className="font-display text-lg">Contact</h3>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field id="phone" label="Phone" defaultValue={settings.phone} />
          <Field id="email" label="Email" defaultValue={settings.email} type="email" />
        </div>
        <Field
          id="whatsapp"
          label="WhatsApp link"
          defaultValue={settings.whatsapp}
          hint="Use the wa.me/<digits> format. Example: https://wa.me/19515550123"
        />
      </section>

      <section className="space-y-3">
        <h3 className="font-display text-lg">Service areas</h3>
        <Label htmlFor="service_areas">One city per line (or comma separated)</Label>
        <Textarea
          id="service_areas"
          name="service_areas"
          rows={6}
          defaultValue={settings.service_areas.join("\n")}
        />
      </section>

      <section className="space-y-5">
        <h3 className="font-display text-lg">Social links</h3>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            id="instagram"
            label="Instagram"
            defaultValue={settings.social_links.instagram ?? ""}
            placeholder="https://instagram.com/bclplastering"
          />
          <Field
            id="facebook"
            label="Facebook"
            defaultValue={settings.social_links.facebook ?? ""}
            placeholder="https://facebook.com/bclplastering"
          />
          <Field
            id="yelp"
            label="Yelp"
            defaultValue={settings.social_links.yelp ?? ""}
            placeholder="https://yelp.com/biz/bclplastering"
          />
          <Field
            id="google"
            label="Google profile"
            defaultValue={settings.social_links.google ?? ""}
            placeholder="https://g.page/bclplastering"
          />
        </div>
      </section>

      {feedback?.kind === "error" ? (
        <div className="flex items-start gap-2 rounded-lg border border-destructive/40 bg-destructive/10 px-3.5 py-2.5 text-sm text-destructive">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <p>{feedback.message}</p>
        </div>
      ) : null}
      {feedback?.kind === "ok" ? (
        <div className="flex items-start gap-2 rounded-lg border border-emerald-400/30 bg-emerald-500/10 px-3.5 py-2.5 text-sm text-emerald-300">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          <p>Settings saved — public site updates within seconds.</p>
        </div>
      ) : null}

      <Button type="submit" size="lg" disabled={pending}>
        {pending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Saving…
          </>
        ) : (
          "Save changes"
        )}
      </Button>
    </form>
  );
}

interface FieldProps {
  id: string;
  label: string;
  defaultValue?: string;
  type?: string;
  placeholder?: string;
  hint?: string;
}

function Field({ id, label, defaultValue, type = "text", placeholder, hint }: FieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        name={id}
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
      />
      {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}
