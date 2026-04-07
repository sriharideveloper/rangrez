import AdminOrdersClient from "./AdminOrdersClient";
import { getAllOrders } from "../../../lib/supabase/orders";

export default async function AdminOrdersPage() {
  const orders = await getAllOrders();

  return (
    <AdminOrdersClient initialOrders={orders} />
  );
}

