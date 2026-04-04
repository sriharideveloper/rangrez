"use server";

import { createClient } from "./server";

/* ---------------------------------
   SUPPORT MESSAGES
--------------------------------- */
export async function sendSupportMessage({ name, email, message }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Either use logged-in ID or leave null for guests
  const payload = {
    user_id: user?.id || null,
    name: name || user?.user_metadata?.name || "Guest",
    email: email || user?.email,
    message,
  };

  if (!payload.email) return { error: "Email is required." };

  const { error } = await supabase.from("support_messages").insert([payload]);
  if (error) return { error: error.message };
  return { success: true };
}

export async function getAdminMessages() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user?.id).single();
  
  if (profile?.role !== "admin") return { error: "Unauthorized" };

  const { data, error } = await supabase
    .from("support_messages")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return { error: error.message };
  return { success: true, messages: data };
}

export async function markMessageRead(id) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user?.id).single();
  if (profile?.role !== "admin") return { error: "Unauthorized" };

  await supabase.from("support_messages").update({ read: true }).eq("id", id);
  return { success: true };
}

export async function deleteMessage(id) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user?.id).single();
  if (profile?.role !== "admin") return { error: "Unauthorized" };

  await supabase.from("support_messages").delete().eq("id", id);
  return { success: true };
}

/* ---------------------------------
   PRODUCT REVIEWS
--------------------------------- */
export async function submitProductReview(productId, rating, comment) {
  const supabase = await createClient();
  const { data: { user }, error: authErr } = await supabase.auth.getUser();

  if (authErr || !user) return { error: "You must be logged in to review a product." };

  const { data: profile } = await supabase.from("profiles").select("full_name").eq("id", user.id).single();
  const userName = profile?.full_name || user.user_metadata?.name || "Anonymous Buyer";

  const { error } = await supabase.from("product_reviews").insert([{
    product_id: productId,
    user_id: user.id,
    user_name: userName,
    rating,
    comment
  }]);

  if (error) return { error: error.message };
  return { success: true };
}

export async function getProductReviews(productId) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("product_reviews")
    .select("*")
    .eq("product_id", productId)
    .order("created_at", { ascending: false });

  if (error) return [];
  return data;
}

export async function getLatestReviews(limit = 6) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("product_reviews")
    .select("*, products(title)")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) return [];
  return data;
}
