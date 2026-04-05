"use server";

import { createClient } from "../../lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function upsertProduct(productData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (profile?.role !== "admin") return { error: "Unauthorized" };

  const { id, ...updates } = productData;
  let response;

  if (id) {
    // Update existing
    response = await supabase.from("products").update(updates).eq("id", id);
  } else {
    // Insert new
    response = await supabase.from("products").insert([updates]);
  }

  if (response.error) {
    return { error: response.error.message };
  }

  revalidatePath("/admin/products");
  revalidatePath("/shop");
  revalidatePath("/");

  return { success: true };
}

export async function deleteProduct(productId) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Unauthorized" };
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (profile?.role !== "admin")
    return { success: false, error: "Unauthorized" };

  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", productId);

  if (error) {
    return { success: false, error: error.message };
  }
  return { success: true };
}

export async function upsertCoupon(formData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user?.id)
    .single();

  if (profile?.role !== "admin") return { error: "Unauthorized" };

  // Generate a payload cleanly for inserts without passing a null string as UUID
  const payload = { ...formData };
  if (!payload.id) {
    delete payload.id;
  }

  // To insert or update efficiently without UUID violating non-null
  // we must insert() if no ID exits, else update() via upsert
  let response;
  if (payload.id) {
    response = await supabase
      .from("coupons")
      .upsert(payload, { onConflict: "id" });
  } else {
    response = await supabase.from("coupons").insert(payload);
  }

  if (response.error) return { success: false, error: response.error.message };
  return { success: true };
}

export async function deleteCoupon(id) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user?.id)
    .single();

  if (profile?.role !== "admin") return { error: "Unauthorized" };

  const { error } = await supabase.from("coupons").delete().eq("id", id);
  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function deleteReview(id) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user?.id)
    .single();

  if (profile?.role !== "admin") return { error: "Unauthorized" };

  const { error } = await supabase.from("testimonials").delete().eq("id", id);
  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function upsertBulkReviews(reviewsArray) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) return { error: "Authentication failed" };

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user?.id)
      .single();

    if (profile?.role !== "admin") return { error: "Unauthorized" };

    const payloads = reviewsArray.map((r) => ({
      name: r.name || "Anonymous",
      role: r.role || "Customer",
      rating: r.rating || 5,
      content: r.content || r.comment || "",
      avatar_url: r.avatar_url || null,
      is_featured: r.is_featured || false,
    }));

    const { error } = await supabase.from("testimonials").insert(payloads);
    if (error) return { error: error.message };

    return { success: true };
  } catch (e) {
    console.error("Bulk Insert Error:", e);
    return { error: e.message || "An unexpected database error occurred" };
  }
}
