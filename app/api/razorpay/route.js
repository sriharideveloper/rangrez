import Razorpay from "razorpay";
import { NextResponse } from "next/server";
import { rateLimit } from "../middleware/rateLimit";

export async function POST(req) {
  // Apply rate limiting: max 10 requests per minute
  const rateLimitResponse = rateLimit(req, 10);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const body = await req.json();
    const { amount, items } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    const key_id = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    if (!key_id || !key_secret || key_id.includes("mock")) {
      // Return mock order for development without real keys
      return NextResponse.json({
        id: `order_mock_${Date.now()}`,
        amount: amount * 100,
        currency: "INR",
        receipt: `rcpt_${Math.floor(Math.random() * 100000)}`,
        status: "created",
        _mock: true,
      });
    }

    const razorpay = new Razorpay({ key_id, key_secret });

    const options = {
      amount: Math.round(amount * 100), // paise
      currency: "INR",
      receipt: `rcpt_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      notes: {
        itemCount: items?.length || 0,
        source: "rangrez-henna",
      },
    };

    const order = await razorpay.orders.create(options);
    return NextResponse.json(order);
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
