"use server";

import { createClient } from "./server";

export async function getShippingConfig() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("shipping_config")
    .select("*")
    .order("destination", { ascending: true });

  if (error) {
    console.error("Error fetching shipping config:", error);
    return [];
  }
  return data;
}

export async function updateShippingConfig(payload) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("shipping_config")
    .upsert(payload, { onConflict: "destination" })
    .select();

  if (error) {
    console.error("Error updating shipping config:", error);
    return { success: false, error: error.message };
  }
  return { success: true, data };
}
