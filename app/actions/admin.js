"use server";

import { createClient } from "../../lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function upsertProduct(productData) {
  const supabase = await createClient();

  const { id, ...updates } = productData;
  let response;

  if (id) {
    // Update existing
    response = await supabase
      .from("products")
      .update(updates)
      .eq("id", id);
  } else {
    // Insert new
    response = await supabase
      .from("products")
      .insert([updates]);
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
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user?.id).single();

  if (profile?.role !== "admin") return { error: "Unauthorized" };

  const { error } = await supabase.from("coupons").upsert(formData, { onConflict: "id" });
  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function deleteCoupon(id) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user?.id).single();

  if (profile?.role !== "admin") return { error: "Unauthorized" };

  const { error } = await supabase.from("coupons").delete().eq("id", id);
  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function deleteReview(id) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user?.id).single();

  if (profile?.role !== "admin") return { error: "Unauthorized" };

  const { error } = await supabase.from("product_reviews").delete().eq("id", id);
  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function upsertBulkReviews(reviewsArray) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user?.id).single();

  if (profile?.role !== "admin") return { error: "Unauthorized" };

  // Assume reviewsArray has product_id, user_name, rating, comment
  const payloads = reviewsArray.map(r => ({
    product_id: r.product_id,
    user_name: r.user_name || "Anonymous",
    rating: r.rating || 5,
    comment: r.comment || "",
  }));

  const { error } = await supabase.from("product_reviews").insert(payloads);
  if (error) return { error: error.message };
  return { success: true };
}
