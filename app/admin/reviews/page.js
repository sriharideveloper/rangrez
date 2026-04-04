import AdminReviewsClient from "./AdminReviewsClient";
import { createClient } from "../../../lib/supabase/server";

export default async function AdminReviewsPage() {
  const supabase = await createClient();
  const { data: reviews } = await supabase.from("product_reviews").select("*").order("created_at", { ascending: false });

  return <AdminReviewsClient initialReviews={reviews || []} />;
}
