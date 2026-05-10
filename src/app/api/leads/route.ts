import { NextResponse, type NextRequest } from "next/server";
import { ZodError } from "zod";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { leadInputSchema, MAX_FILES } from "@/lib/leads/schema";
import { uploadLeadPhotos, UploadError } from "@/lib/leads/storage";
import { sendNewLeadEmail } from "@/lib/notifications/email";
import { sendNewLeadSms } from "@/lib/notifications/sms";
import { services } from "@/data/services";
import { site } from "@/lib/site";
import { logger } from "@/lib/logger";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Supabase is not configured on this environment." },
      { status: 503 }
    );
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form payload." }, { status: 400 });
  }

  // ----- 1. Validate text fields -----
  const fields = {
    full_name: form.get("full_name"),
    phone: form.get("phone"),
    email: form.get("email"),
    city: form.get("city"),
    service_type: form.get("service_type"),
    message: form.get("message"),
  };

  let parsed;
  try {
    parsed = leadInputSchema.parse({
      full_name: typeof fields.full_name === "string" ? fields.full_name : "",
      phone: typeof fields.phone === "string" ? fields.phone : "",
      email: typeof fields.email === "string" ? fields.email : null,
      city: typeof fields.city === "string" ? fields.city : "",
      service_type:
        typeof fields.service_type === "string" ? fields.service_type : "",
      message: typeof fields.message === "string" ? fields.message : null,
    });
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json(
        { error: "Invalid form data", details: err.flatten().fieldErrors },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  // ----- 2. Collect files -----
  const photos = form.getAll("photos").filter((v): v is File => v instanceof File);
  if (photos.length > MAX_FILES) {
    return NextResponse.json(
      { error: `Too many files. Limit is ${MAX_FILES}.` },
      { status: 400 }
    );
  }

  const supabase = createAdminSupabase();
  const leadId = crypto.randomUUID();

  // ----- 3. Upload photos (if any) -----
  let urls: string[] = [];
  if (photos.length > 0) {
    try {
      const uploaded = await uploadLeadPhotos(supabase, leadId, photos);
      urls = uploaded.map((u) => u.url);
    } catch (err) {
      if (err instanceof UploadError) {
        return NextResponse.json({ error: err.message }, { status: 400 });
      }
      logger.error("[/api/leads] upload failed", err);
      return NextResponse.json(
        { error: "Photo upload failed. Please try again." },
        { status: 500 }
      );
    }
  }

  // ----- 4. Insert lead row -----
  const { error: insertError } = await supabase.from("leads").insert({
    id: leadId,
    full_name: parsed.full_name,
    phone: parsed.phone,
    email: parsed.email,
    city: parsed.city,
    service_type: parsed.service_type,
    message: parsed.message,
    project_photo_urls: urls,
  });

  if (insertError) {
    logger.error("[/api/leads] insert failed", insertError);
    return NextResponse.json(
      { error: "Could not save your request. Please try again." },
      { status: 500 }
    );
  }

  // ----- 5. Fire notifications (best-effort) -----
  // The lead is already saved — notification failures must not
  // surface to the homeowner. We still await so logs land before
  // the request closes on serverless platforms.
  const serviceLabel =
    services.find((s) => s.type === parsed.service_type)?.title ??
    parsed.service_type;
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    (req.nextUrl.origin ?? site.url);
  const dashboardUrl = `${baseUrl}/dashboard/leads/${leadId}`;

  await Promise.allSettled([
    sendNewLeadEmail({
      leadId,
      fullName: parsed.full_name,
      phone: parsed.phone,
      email: parsed.email,
      city: parsed.city,
      serviceLabel,
      message: parsed.message,
      photoCount: urls.length,
      photoUrls: urls,
      dashboardUrl,
    }),
    sendNewLeadSms({
      fullName: parsed.full_name,
      city: parsed.city,
      serviceLabel,
      phone: parsed.phone,
    }),
  ]);

  return NextResponse.json({ ok: true, id: leadId }, { status: 201 });
}
