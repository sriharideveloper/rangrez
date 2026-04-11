import { NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "../../../../lib/supabase/server";

export async function POST(req) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-razorpay-signature");
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!secret || !signature) {
      return NextResponse.json(
        {
          success: false,
          error: "Webhook not configured or missing signature",
        },
        { status: 400 },
      );
    }

    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(rawBody)
      .digest("hex");

    if (expectedSignature !== signature) {
      return NextResponse.json(
        { success: false, error: "Invalid webhook signature" },
        { status: 400 },
      );
    }

    const body = JSON.parse(rawBody);

    // We only care about successful payments
    if (body.event === "payment.captured" || body.event === "order.paid") {
      let razorpay_order_id;
      let razorpay_payment_id;

      if (body.event === "order.paid") {
        razorpay_order_id = body.payload.order.entity.id;
        // Grab first payment if exists
        const payments = body.payload.payment?.entity;
        razorpay_payment_id = payments?.id || "webhook-capture";
      } else {
        razorpay_payment_id = body.payload.payment.entity.id;
        razorpay_order_id = body.payload.payment.entity.order_id;
      }

      if (!razorpay_order_id) {
        return NextResponse.json({
          success: true,
          message: "Event ignored, no order ID",
        });
      }

      const supabase = await createClient();

      // 1. Claim session atomically so the client /verify doesn't duplicate it
      const { data: sessionData, error: claimError } = await supabase.rpc(
        "claim_payment_session",
        {
          p_rzp_order_id: razorpay_order_id,
        },
      );

      if (claimError || !sessionData) {
        return NextResponse.json({
          success: true,
          message: "Session already processed by client.",
        });
      }

      // 2. Destructure Data
      const { user_id, order_data } = sessionData;
      const { items, subtotal, discount_amount, coupon_code, total, address } =
        order_data;

      // 3. Place Order (Deducts stock securely)
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
          p_total: total,
          p_items: items,
        },
      );

      if (!dbError) {
        // 4. Update Payment Identity & mark session paid securely
        await supabase.rpc("finalize_payment_session", {
          p_order_id: orderId,
          p_rzp_order_id: razorpay_order_id,
          p_payment_id: razorpay_payment_id,
        });
      } else {
        console.error("Webhook Order DB insertion failed:", dbError);
        // Rollback lock so next retry works
        await supabase.rpc("rollback_payment_session", { p_rzp_order_id: razorpay_order_id });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
