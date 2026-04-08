import { getProductBySlug } from "../../../../lib/supabase/products";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export async function GET(request, { params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return new Response(JSON.stringify({ error: "Product not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify(product), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
