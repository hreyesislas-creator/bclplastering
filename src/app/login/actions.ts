"use server";

import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export interface SignInResult {
  ok: boolean;
  error?: string;
}

export async function signIn(formData: FormData): Promise<SignInResult> {
  if (!isSupabaseConfigured()) {
    return { ok: false, error: "Supabase is not configured." };
  }

  // FormData fields can be null when a browser quirk or autofill
  // submits before a value is set — coerce to string so the schema
  // and Supabase Auth never see a null.
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const nextRaw = String(formData.get("next") ?? "");

  if (!email || !password) {
    return { ok: false, error: "Enter your email and password." };
  }

  const supabase = await createServerSupabase();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return {
      ok: false,
      error:
        error.message === "Invalid login credentials"
          ? "Email or password is incorrect."
          : error.message,
    };
  }

  const target = nextRaw.startsWith("/dashboard") ? nextRaw : "/dashboard";
  redirect(target);
}

export async function signOut() {
  if (!isSupabaseConfigured()) {
    redirect("/login");
  }
  const supabase = await createServerSupabase();
  await supabase.auth.signOut();
  redirect("/login");
}
