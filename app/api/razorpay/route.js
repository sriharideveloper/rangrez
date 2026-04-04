import Razorpay from "razorpay";
import { NextResponse } from "next/server";

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_mock_key123",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "rzp_test_mock_secret123",
});

export async function POST(req) {
  try {
    const body = await req.json();
    const { amount } = body; // Amount should be passed in INR (not paise from client, let's assume client sends INR)

    const options = {
      amount: amount * 100, // Razorpay expects amount in paise
      currency: "INR",
      receipt: `receipt_${Math.floor(Math.random() * 10000)}`,
    };

    const order = await razorpay.orders.create(options);
    return NextResponse.json(order);
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 },
    );
  }
}
