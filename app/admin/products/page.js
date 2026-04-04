import AdminProductsClient from "./AdminProductsClient";
import { getAllProducts } from "../../../lib/supabase/products";

export default async function AdminProductsPage() {
  const products = await getAllProducts();

  return <AdminProductsClient initialProducts={products} />;
}
