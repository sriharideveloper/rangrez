
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function run() {
  const { data, error } = await supabase.rpc("set_user_role", {
    target_user_id: "00000000-0000-0000-0000-000000000000",
    new_role: "admin"
  });
  console.log("RPC Data:", data);
  console.log("RPC Error:", error);
}

run();

