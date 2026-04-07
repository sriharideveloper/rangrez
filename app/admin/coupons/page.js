import AdminCouponsClient from "./AdminCouponsClient";
import { getAllCoupons } from "../../../lib/supabase/coupons";

export default async function AdminCouponsPage() {
  const coupons = await getAllCoupons();

  return <AdminCouponsClient initialCoupons={coupons || []} />;
}

