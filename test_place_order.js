const { createClient } = require("@supabase/supabase-js");
require("dotenv").config({ path: ".env" });

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data, error } = await supabase.rpc("place_order", {
    p_user_id: null,
    p_email: "test@example.com",
    p_phone: "1234567890",
    p_name: "Tester",
    p_shipping: { state: "Kerala" },
    p_subtotal: 100,
    p_discount: 0,
    p_coupon: null,
    p_shipping_fee: 0,
    p_total: 100,
    p_items: [
      { product_id: "1540cb56-651a-4ea8-aa92-f0bbf350228b", quantity: 1 },
    ],
  });
  console.log("Place Order Result:", data, "\nError:", error);
}
check();
