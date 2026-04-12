import {
  getProductBySlug,
  getAllProducts,
} from "../../../lib/supabase/products";
import { getProductReviews } from "../../../lib/supabase/engagement";
import ProductClient from "./ProductClient";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import Script from "next/script";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

// SEO Dynamic Metadata
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) return { title: "Product Not Found | Rangrez" };

  return {
    title: `${product.title} | Peel, Paste, Slay | Rangrez Henna`,
    description: `Don't pay the salon ₹5K for this! Get the ${product.title} stencil today and slay your Kerala wedding look in 5 flat minutes.`,
    openGraph: {
      title: `${product.title} | Zero Tears, Maximum Slay`,
      type: "website",
      url: `https://www.rangrezstencils.in/shop/${product.slug}`,
      description:
        product.description ||
        `Don't pay the salon ₹5K for this! Get the ${product.title} stencil today and slay your Kerala wedding look in 5 flat minutes.`,
      images: [
        {
          url: `/shop/${slug}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: product.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.title} | Zero Tears, Maximum Slay`,
      description: `Don't pay the salon ₹5K for this! Get the ${product.title} stencil today and slay your look in 5 minutes.`,
      images: [`/shop/${slug}/opengraph-image`],
    },
    alternates: {
      canonical: `https://www.rangrezstencils.in/shop/${product.slug}`,
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
    .filter((x) => x.size === product.size && x.id !== product.id)
    .slice(0, 3);
  const reviews = await getProductReviews(product.id);

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    image: `https://www.rangrezstencils.in/shop/${product.slug}/opengraph-image`,
    description: product.description || "Premium DIY bridal henna stencils.",
    brand: {
      "@type": "Brand",
      name: "Rangrez Henna",
    },
    offers: {
      "@type": "Offer",
      url: `https://www.rangrezstencils.in/shop/${product.slug}`,
      priceCurrency: "INR",
      price: product.price,
      availability:
        product.stock_status === "in_stock"
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
    },
    // Adding aggregate rating if reviews exists
    ...(reviews &&
      reviews.length > 0 && {
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: (
            reviews.reduce((acc, r) => acc + (r.rating || 5), 0) /
            reviews.length
          ).toFixed(1),
          reviewCount: reviews.length,
        },
      }),
  };

  return (
    <>
      <Script
        id="product-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <ProductClient
        product={product}
        related={related}
        initialReviews={reviews}
      />
    </>
  );
}
