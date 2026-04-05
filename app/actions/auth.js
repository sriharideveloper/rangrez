"use server";

import { createClient as createSSRClient } from "../../lib/supabase/server";
import { createClient as createJSClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { z } from "zod";

const signUpSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  fullName: z
    .string()
    .min(1, "Full name is required")
    .optional()
    .or(z.literal("")),
});

const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
  redirect: z.string().optional(),
});

export async function signUp(formData) {
  const supabase = await createSSRClient();
  const headersList = await headers();
  const host = headersList.get("x-forwarded-host") || headersList.get("host");
  const protocol = headersList.get("x-forwarded-proto") || "https";
  const origin = `${protocol}://${host}`;

  const rawData = {
    email: formData.get("email"),
    password: formData.get("password"),
    fullName: formData.get("fullName"),
  };

  const parsed = signUpSchema.safeParse(rawData);
  if (!parsed.success) {
    return { error: parsed.error.errors[0].message };
  }

  const { email, password, fullName } = parsed.data;

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  return { success: "Check your email to confirm your account!" };
}

export async function signIn(formData) {
  const supabase = await createSSRClient();
  const rawData = {
    email: formData.get("email"),
    password: formData.get("password"),
    redirect: formData.get("redirect") || "/account",
  };

  const parsed = signInSchema.safeParse(rawData);
  if (!parsed.success) {
    return { error: parsed.error.errors[0].message };
  }

  const { email, password, redirect: redirectTo } = parsed.data;

  const { data: signInData, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  // Ensure profile is updated/exists upon login
  const { user, session } = signInData;
  if (user && session) {
    const fullName =
      user.user_metadata?.full_name || user.user_metadata?.name || "";
    const avatarUrl =
      user.user_metadata?.avatar_url || user.user_metadata?.picture || "";

    // Explicitly create an authorized client since the SSR client's req.cookies don't have the token yet
    const authClient = createJSClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        global: {
          headers: { Authorization: `Bearer ${session.access_token}` },
        },
      },
    );

    await authClient.from("profiles").upsert(
      {
        id: user.id,
        full_name: fullName,
        avatar_url: avatarUrl,
      },
      { onConflict: "id" },
    );
  }

  redirect(redirectTo);
}

export async function signInWithGoogle() {
  const supabase = await createSSRClient();
  const headersList = await headers();
  const host = headersList.get("x-forwarded-host") || headersList.get("host");
  const protocol = headersList.get("x-forwarded-proto") || "https";
  const origin = `${protocol}://${host}`;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/auth/callback`,
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  if (data.url) {
    redirect(data.url);
  }
}

export async function signOut() {
  const supabase = await createSSRClient();
  await supabase.auth.signOut();
  redirect("/");
}

export async function getUser() {
  const supabase = await createSSRClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return { ...user, profile };
}
