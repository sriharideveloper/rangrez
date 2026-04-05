"use server";

import { createClient } from "./server";

export async function validateCoupon(code, cartItems) {
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

  // Validation for date range
  const now = new Date();
  if (coupon.valid_from && new Date(coupon.valid_from) > now) {
    return { error: "This coupon is not valid yet." };
  }
  if (coupon.valid_until && new Date(coupon.valid_until) < now) {
    return { error: "This coupon has expired." };
  }

  // Calculate eligible subtotal based on allowed_products
  let eligibleSubtotal = 0;

  if (coupon.allowed_products && coupon.allowed_products.length > 0) {
    const hasAllowedProduct = cartItems.some((item) =>
      coupon.allowed_products.includes(item.id),
    );
    if (!hasAllowedProduct) {
      return { error: "This coupon is not valid for any items in your cart." };
    }

    // Only calculate discount on eligible items
    cartItems.forEach((item) => {
      if (coupon.allowed_products.includes(item.id)) {
        eligibleSubtotal += item.price * item.quantity;
      }
    });
  } else {
    // Valid for all products
    eligibleSubtotal = cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );
  }

  if (eligibleSubtotal < coupon.minimum_spend) {
    return {
      error: `Add ₹${(coupon.minimum_spend - eligibleSubtotal).toFixed(2)} more of eligible products to use this coupon.`,
    };
  }

  return { success: true, coupon, eligibleSubtotal };
}

export async function getAllCoupons() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("coupons")
    .select("*")
    .order("created_at", { ascending: false });
  return data || [];
}
