import { NextResponse } from "next/server";
import crypto from "crypto";
import { rateLimit } from "../../middleware/rateLimit";
import { createClient } from "../../../../lib/supabase/server";

export async function POST(req) {
  const rateLimitResponse = rateLimit(req, 10);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const body = await req.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

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
    }

    const supabase = await createClient();

    // 1. Claim session atomically so webhook doesn't duplicate it
    const { data: sessionData, error: claimError } = await supabase.rpc(
      "claim_payment_session",
      {
        p_rzp_order_id: razorpay_order_id,
      },
    );

    if (claimError || !sessionData) {
      // If it fails, check if it was ALREADY processed by webhook.
      const { data: existingSession } = await supabase
        .from("payment_sessions")
        .select("status, order_data")
        .eq("razorpay_order_id", razorpay_order_id)
        .single();

      if (existingSession && existingSession.status === "paid") {
        return NextResponse.json({
          success: true,
          message: "Payment already verified",
        });
      }
      return NextResponse.json(
        { success: false, error: "Session invalid or already processed." },
        { status: 400 },
      );
    }

    // 2. Destructure Data
    const { user_id, order_data } = sessionData;
    const {
      items,
      subtotal,
      discount_amount,
      coupon_code,
      total,
      shipping_fee,
      address,
    } = order_data;

    // 3. Place Order (Deducts stock securely only after pay)
    const { data: orderId, error: dbError } = await supabase.rpc(
      "place_order",
      {
        p_user_id: user_id,
        p_email: address.email,
        p_phone: address.phone,
        p_name: address.name,
        p_shipping: address,
        p_subtotal: subtotal || total,
        p_discount: discount_amount || 0,
        p_coupon: coupon_code || null,
        p_shipping_fee: shipping_fee || 0,
        p_total: total,
        p_items: items,
      },
    );

    if (dbError) {
      console.error("Order DB insertion failed:", dbError);

      // Rollback session lock so they can retry or webhook can catch it
      await supabase.rpc("rollback_payment_session", {
        p_rzp_order_id: razorpay_order_id,
      });

      return NextResponse.json(
        {
          success: false,
          error: "Payment verified but failed to record order.",
        },
        { status: 500 },
      );
    }

    // 4. Update Payment Identity & mark session paid securely bypassing RLS
    const { error: finalizeError } = await supabase.rpc(
      "finalize_payment_session",
      {
        p_order_id: orderId,
        p_rzp_order_id: razorpay_order_id,
        p_payment_id: razorpay_payment_id,
      },
    );

    if (finalizeError) {
      console.error("Order finalization failed:", finalizeError);
      return NextResponse.json(
        {
          success: false,
          error: "Payment verified but failed to link payment ID.",
        },
        { status: 500 },
      );
    }

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
