"use server";

import { createClient } from "./server";

export async function validateCoupon(code, subtotal) {
  if (!code) return { error: "Please enter a coupon code." };

  const supabase = await createClient();

  // Search case-insensitively
  const { data: coupon, error } = await supabase
    .from("coupons")
    .select("*")
    .ilike("code", code)
    .single();

  if (error || !coupon) {
    return { error: "Invalid coupon code." };
  }

  if (!coupon.active) {
    return { error: "This coupon is no longer active." };
  }

  if (subtotal < coupon.minimum_spend) {
    return { error: `Add ₹${(coupon.minimum_spend - subtotal).toFixed(2)} more to use this coupon.` };
  }

  return { success: true, coupon };
}

export async function getAllCoupons() {
  const supabase = await createClient();
  const { data } = await supabase.from("coupons").select("*").order("created_at", { ascending: false });
  return data || [];
}
