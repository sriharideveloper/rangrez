require("dotenv").config({ path: ".env" });
const { createClient } = require("@supabase/supabase-js");
const Razorpay = require("razorpay");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  console.log(
    "\n[INFO] Razorpay credentials missing from .env. The system is still safe.",
  );
  console.log(
    "If you need to recover payments later when Live, add your Razorpay keys and run this.",
  );
  process.exit(0);
}

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

async function reconcile() {
  console.log("\n=======================================================");
  console.log("100000% GUARANTEE RECONCILIATION SCRIPT");
  console.log("=======================================================\n");

  const { data: stuckSessions, error } = await supabase
    .from("payment_sessions")
    .select("*")
    .in("status", ["pending", "processing"]);

  if (error) {
    if (error.message.includes("RLS")) {
      console.log(
        "You must run this script with a SUPABASE_SERVICE_ROLE_KEY in .env",
      );
    } else {
      console.error("Database connection failed:", error.message);
    }
    return;
  }

  if (!stuckSessions || stuckSessions.length === 0) {
    console.log("CLEAN SYSTEM: No stuck or pending payment sessions found.");
    return;
  }

  console.log(
    "Found " +
      stuckSessions.length +
      " pending/processing session(s). Cross-checking with Razorpay API...",
  );
  let recovered = 0;

  for (const session of stuckSessions) {
    try {
      const rzpOrder = await razorpay.orders.fetch(session.razorpay_order_id);

      if (rzpOrder.status === "paid") {
        console.log(
          "\nPAYMENT LOCATED for Order " +
            session.razorpay_order_id +
            ". Generating missing DB entries...",
        );

        const { data: orderData, error: claimErr } = await supabase.rpc(
          "claim_payment_session",
          { p_rzp_order_id: session.razorpay_order_id },
        );
        if (claimErr || !orderData) {
          console.log("Could not lock session. Skip to next.");
          continue;
        }

        const dataInfo =
          typeof orderData === "string" ? JSON.parse(orderData) : orderData;
        const payments = await razorpay.orders.fetchPayments(
          session.razorpay_order_id,
        );
        const paymentId =
          payments.items && payments.items.length > 0
            ? payments.items[0].id
            : "manual-reconcile-rec";

        const { data: orderId, error: dbError } = await supabase.rpc(
          "place_order",
          {
            p_user_id: session.user_id || null,
            p_email: dataInfo.address?.email || "",
            p_phone: dataInfo.address?.phone || "",
            p_name: dataInfo.address?.name || "",
            p_shipping: dataInfo.address || {},
            p_subtotal: dataInfo.subtotal || 0,
            p_discount: dataInfo.discount_amount || 0,
            p_coupon: dataInfo.coupon_code || null,
            p_total: dataInfo.total || 0,
            p_items: dataInfo.items || [],
          },
        );

        if (dbError) {
          console.error("Failed to inject Database Order:", dbError.message);
          await supabase.rpc("rollback_payment_session", {
            p_rzp_order_id: session.razorpay_order_id,
          });
          continue;
        }

        const { error: finErr } = await supabase.rpc(
          "finalize_payment_session",
          {
            p_order_id: orderId,
            p_rzp_order_id: session.razorpay_order_id,
            p_payment_id: paymentId,
          },
        );

        if (!finErr) {
          console.log(
            "FULLY RECOVERED! Injected directly into Supabase as Order ID: " +
              orderId,
          );
          recovered++;
        } else {
          console.log("Finalization failed. Order placed but session stuck.");
        }
      } else {
        console.log(
          "Session " +
            session.razorpay_order_id +
            " is legitimately unpaid in Razorpay (" +
            rzpOrder.status +
            "). Kept pending.",
        );
      }
    } catch (err) {
      console.error(
        "API Error checking " + session.razorpay_order_id + ":",
        err.message,
      );
    }
  }

  console.log("\n=======================================================");
  console.log(
    "RECONCILIATION COMPLETE. Recovered " + recovered + " stuck payment(s).",
  );
  console.log("=======================================================\n");
}

reconcile();
