import { NextResponse } from "next/server";
import crypto from "crypto";
import { rateLimit } from "../../middleware/rateLimit";
import { createClient } from "../../../../lib/supabase/server";

export async function POST(req) {
  const rateLimitResponse = rateLimit(req, 10);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const body = await req.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      items,
      total,
      address,
      subtotal,
      discount_amount,
      coupon_code,
    } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { success: false, error: "Missing payment details" },
        { status: 400 },
      );
    }

    const isMockSetup =
      process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID?.includes("mock");
    const secret = process.env.RAZORPAY_KEY_SECRET;

    if (!secret && !isMockSetup) {
      return NextResponse.json(
        { success: false, error: "Server configuration error" },
        { status: 500 },
      );
    }

    if (!isMockSetup) {
      const expectedSignature = crypto
        .createHmac("sha256", secret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");

      if (expectedSignature !== razorpay_signature) {
        return NextResponse.json(
          { success: false, error: "Invalid payment signature" },
          { status: 400 },
        );
      }

      // Verify that the amount paid actually matches the requested order total
      let fetchOrderResponse;
      try {
        const key_id = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
        const rzpAuth = Buffer.from(`${key_id}:${secret}`).toString("base64");
        const orderLookup = await fetch(
          `https://api.razorpay.com/v1/orders/${razorpay_order_id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Basic ${rzpAuth}`,
            },
          },
        );
        fetchOrderResponse = await orderLookup.json();

        if (!fetchOrderResponse || fetchOrderResponse.error) {
          return NextResponse.json(
            { success: false, error: "Cannot verify order amount" },
            { status: 400 },
          );
        }

        const expectedAmount = Math.round(total * 100); // converting to paise
        if (fetchOrderResponse.amount !== expectedAmount) {
          return NextResponse.json(
            {
              success: false,
              error: "Payment amount does not match order total",
            },
            { status: 400 },
          );
        }
      } catch (err) {
        console.error("Order fetch error:", err);
      }
    }

    // Payment verified successfully! Insert via RPC
    const supabase = await createClient();
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData?.user?.id || null;

    const { data: orderId, error: dbError } = await supabase.rpc(
      "place_order",
      {
        p_user_id: userId,
        p_email: address.email,
        p_phone: address.phone,
        p_name: address.name,
        p_shipping: address,
        p_subtotal: subtotal || total,
        p_discount: discount_amount || 0,
        p_coupon: coupon_code || null,
        p_total: total,
        p_items: items,
      },
    );

    if (dbError) {
      console.error("Order DB insertion failed:", dbError);
      return NextResponse.json(
        {
          success: false,
          error: "Payment verified but failed to record order.",
        },
        { status: 500 },
      );
    }

    // Explicitly update payment info immediately after RPC correctly logs it in DB
    await supabase
      .from("orders")
      .update({
        payment_id: razorpay_payment_id,
        payment_status: "paid",
      })
      .eq("id", orderId);

    return NextResponse.json({
      success: true,
      message: "Payment verified successfully",
      order_id: orderId,
    });
  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
