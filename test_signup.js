require("dotenv").config({ path: ".env.local" });
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

async function test() {
  const { data, error } = await supabase.auth.signUp({
    email: "test_" + Date.now() + "@test.com",
    password: "password123",
  });
  console.log("Signup:", data, error);
}

test();
