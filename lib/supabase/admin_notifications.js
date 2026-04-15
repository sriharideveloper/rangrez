"use server";
import { createClient } from "./server";

export async function getAdminNotifications() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("admin_notifications")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .limit(30);
  if (error) return { error: error.message };
  return { notifications: data };
}

export async function markAdminNotificationRead(id) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("admin_notifications")
    .update({ is_read: true })
    .eq("id", id);
  if (error) return { error: error.message };
  return { success: true };
}
