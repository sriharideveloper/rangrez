import { NextResponse } from "next/server";
import crypto from "crypto";
import { rateLimit } from "../../middleware/rateLimit";

export async function POST(req) {
  // Apply rate limiting: max 10 requests per minute
  const rateLimitResponse = rateLimit(req, 10);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const body = await req.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, items, total, address } = body;

    // Validate required fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ success: false, error: "Missing payment details" }, { status: 400 });
    }

    // Verify signature using HMAC SHA256
    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      return NextResponse.json({ success: false, error: "Server configuration error" }, { status: 500 });
    }

    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      console.error("Payment signature verification failed");
      return NextResponse.json({ success: false, error: "Invalid payment signature" }, { status: 400 });
    }

    // Payment verified successfully
    // In production, create order record in Supabase here:
    // const supabase = await createClient();
    // await supabase.from("orders").insert({
    //   user_id: userId,
    //   items,
    //   total,
    //   shipping_address: address,
    //   razorpay_order_id,
    //   razorpay_payment_id,
    //   status: "processing",
    // });

    return NextResponse.json({
      success: true,
      message: "Payment verified successfully",
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
    });
  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.json({ success: false, error: "Verification failed" }, { status: 500 });
  }
}
