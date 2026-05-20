"use server";

import { createClient } from "../../lib/supabase/server";
import { revalidatePath } from "next/cache";
import { sendStatusUpdateEmail } from "../email";

export async function getAllOrders() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .select(
      `
      *,
      customer_email
    `,
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
  return data;
}

export async function updateOrderDetails(orderId, updates) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("orders")
    .update(updates)
    .eq("id", orderId);

  if (error) {
    return { error: error.message };
  }

  // Send Status Update Email if order_status or tracking info was updated
  if (updates.order_status || updates.tracking_url) {
    const { data: orderData } = await supabase
      .from("orders")
      .select("id, customer_email, customer_name, shipping_address, users(email)")
      .eq("id", orderId)
      .single();

    if (orderData) {
      const email = orderData.customer_email || orderData.shipping_address?.email || orderData.users?.email;
      const name = orderData.customer_name || orderData.shipping_address?.name;
      
      if (email) {
        sendStatusUpdateEmail(orderId, email, name, updates).catch(err => {
          console.error("Failed to send status update email:", err);
        });
      }
    }
  }

  revalidatePath("/admin/orders");
  return { success: true };
}
