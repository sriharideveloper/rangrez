import {
  getProductBySlug,
  getAllProducts,
} from "../../../lib/supabase/products";
import { getProductReviews } from "../../../lib/supabase/engagement";
import ProductClient from "./ProductClient";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";

// Static param generation for "Buttery Smooth" pre-rendering
export async function generateStaticParams() {
  const products = await getAllProducts();
  if (!products || !Array.isArray(products)) return [];
  return products.map((product) => ({
    slug: product.slug,
  }));
}

// SEO Dynamic Metadata
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) return { title: "Product Not Found | Rangrez" };

  return {
    title: `${product.name} | Peel, Paste, Slay | Rangrez Henna`,
    description: `Don't pay the salon ₹5K for this! Get the ${product.name} stencil today and slay your Kerala wedding look in 5 flat minutes.`,
    openGraph: {
      title: `${product.name} | Zero Tears, Maximum Slay`,
      description:
        product.description ||
        `Don't pay the salon ₹5K for this! Get the ${product.name} stencil today and slay your Kerala wedding look in 5 flat minutes.`,
      images: [`/shop/${slug}/opengraph-image`],
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} | Zero Tears, Maximum Slay`,
      description: `Don't pay the salon ₹5K for this! Get the ${product.name} stencil today and slay your look in 5 minutes.`,
    },
  };
}

export default async function ProductPage({ params }) {
  const { slug } = await params;

  const product = await getProductBySlug(slug);

  if (!product) {
    return (
      <div style={{ padding: "8rem 2rem", textAlign: "center" }}>
        <h1 className="title-section">Product Not Found</h1>
        <Link
          href="/shop"
          className="brutalist-button"
          style={{ marginTop: "2rem", display: "inline-flex" }}
        >
          <ArrowLeft size={18} /> Back to Shop
        </Link>
      </div>
    );
  }

  const allProducts = await getAllProducts();
  const related = allProducts
    .filter((x) => x.category === product.category && x.id !== product.id)
    .slice(0, 3);
  const reviews = await getProductReviews(product.id);

  return (
    <ProductClient
      product={product}
      related={related}
      initialReviews={reviews}
    />
  );
}
