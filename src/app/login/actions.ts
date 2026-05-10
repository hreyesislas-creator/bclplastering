"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createServerSupabase } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

const schema = z.object({
  email: z.string().trim().email("Enter a valid email"),
  password: z.string().min(6, "Password is too short"),
  next: z.string().optional(),
});

export interface SignInResult {
  ok: boolean;
  error?: string;
}

export async function signIn(formData: FormData): Promise<SignInResult> {
  if (!isSupabaseConfigured()) {
    return { ok: false, error: "Supabase is not configured." };
  }

  const parsed = schema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    next: formData.get("next"),
  });
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Invalid credentials.",
    };
  }

  const supabase = await createServerSupabase();
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
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

  const target = parsed.data.next?.startsWith("/dashboard")
    ? parsed.data.next
    : "/dashboard";
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
