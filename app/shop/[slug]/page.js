import { getProductBySlug, getAllProducts } from "../../../lib/supabase/products";
import { getProductReviews } from "../../../lib/supabase/engagement";
import ProductClient from "./ProductClient";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";

// Static param generation for "Buttery Smooth" pre-rendering
export async function generateStaticParams() {
  const products = await getAllProducts();
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
    title: `${product.name} | DIY Henna Stencil Kochi`,
    description: product.description || "Bridal-quality henna stencils from Kochi.",
    openGraph: {
      title: product.name,
      description: product.description,
      images: [`/shop/${slug}/opengraph-image`],
    }
  };
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  
  const product = await getProductBySlug(slug);
  
  if (!product) {
    return (
      <div style={{ padding: "8rem 2rem", textAlign: "center" }}>
        <h1 className="title-section">Product Not Found</h1>
        <Link href="/shop" className="brutalist-button" style={{ marginTop: "2rem", display: "inline-flex" }}>
          <ArrowLeft size={18} /> Back to Shop
        </Link>
      </div>
    );
  }

  const allProducts = await getAllProducts();
  const related = allProducts.filter(x => x.category === product.category && x.id !== product.id).slice(0, 3);
  const reviews = await getProductReviews(product.id);

  return <ProductClient product={product} related={related} initialReviews={reviews} />;
}
