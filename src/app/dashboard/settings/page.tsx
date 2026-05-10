import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { SettingsForm } from "@/components/dashboard/settings-form";
import { getSiteSettings } from "@/lib/settings";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const settings = await getSiteSettings();
  const configured = isSupabaseConfigured();

  return (
    <div className="space-y-8">
      <DashboardHeader
        title="Settings"
        description="Business profile shown on the public site. Updates apply immediately."
      />

      {!configured ? (
        <div className="rounded-xl border border-dashed border-border bg-surface/40 p-8 text-center">
          <p className="text-sm text-muted-foreground">
            Connect Supabase to edit your business profile from here.
          </p>
        </div>
      ) : null}

      <section className="rounded-2xl border border-border surface-elevated p-6 sm:p-10">
        <SettingsForm settings={settings} />
      </section>

      <section className="rounded-2xl border border-dashed border-border bg-surface/40 p-6 sm:p-8 space-y-2">
        <h2 className="font-display text-lg">Notifications</h2>
        <p className="text-sm text-muted-foreground">
          New-lead emails are sent via Resend when{" "}
          <span className="font-mono">RESEND_API_KEY</span> and{" "}
          <span className="font-mono">LEAD_NOTIFICATION_EMAIL</span> are set.
          SMS alerts pick up automatically once Twilio credentials and{" "}
          <span className="font-mono">LEAD_NOTIFICATION_PHONE</span> are
          configured in your environment.
        </p>
      </section>
    </div>
  );
}
