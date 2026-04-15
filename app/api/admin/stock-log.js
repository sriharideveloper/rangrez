import { createClient } from "../../../lib/supabase/server";

export default async function handler(req, res) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("stock_log")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(30);
  return Response.json({ stock_log: data || [] });
}
