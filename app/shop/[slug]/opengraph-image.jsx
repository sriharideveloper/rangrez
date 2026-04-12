import { ImageResponse } from "next/og";
import { getProductBySlug } from "../../../lib/supabase/products";

export const runtime = "edge";
export const alt = "Rangrez Henna Product Preview";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }) {
  let product = null;
  try {
    const { slug } = await params;
    product = await getProductBySlug(slug);
  } catch (err) {
    console.error("Error fetching product for OG image:", err);
  }

  if (!product) {
    return new ImageResponse(
      (
        <div style={{ background: "#A44A3F", width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 100, fontWeight: "bold" }}>
          RANGREZ MAGIC
        </div>
      ),
      { ...size }
    );
  }

  const featuredImage = product.images?.[0] || product.image_url || "https://www.rangrezstencils.in/images/hero-henna.png";

  return new ImageResponse(
    (
      <div
        style={{
          fontFamily: "system-ui, sans-serif",
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "flex-end",
          backgroundColor: "#111",
          backgroundImage: `linear-gradient(to bottom, transparent, rgba(17,17,17,0.85), #111), url(${featuredImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          padding: "60px",
          color: "white",
        }}
      >
        <div style={{ position: "absolute", top: 60, left: 60, display: "flex", alignItems: "center", gap: 20 }}>
           <div style={{ width: 80, height: 80, background: "rgba(164,74,63,0.9)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, fontWeight: 900 }}>R</div>
           <div style={{ fontSize: 28, fontWeight: 900, letterSpacing: 5 }}>RANGREZ HENNA</div>
        </div>

        <div style={{ position: "absolute", top: 60, right: 60, background: "#ffb347", color: "#111", padding: "10px 40px", borderRadius: 100, fontSize: 32, fontWeight: 800, transform: "rotate(5deg)" }}>
          BRIDE APPROVED
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 20 }}>
          <div style={{ fontSize: 24, background: "rgba(164,74,63,0.9)", padding: "10px 24px", borderRadius: 100, fontWeight: 800, textTransform: "uppercase" }}>#PREMIUMSTENCILS</div>
        </div>

        <div style={{ fontSize: 84, fontWeight: 900, lineHeight: 1.1, textTransform: "uppercase", marginBottom: 30, maxWidth: "1000px", textShadow: "0 10px 20px rgba(0,0,0,0.8)" }}>
          {product.title}
        </div>

        <div style={{ fontSize: 48, fontWeight: 900, display: "flex", alignItems: "center", gap: 24 }}>
           <div style={{ color: "#ffb347", fontWeight: 900 }}>Rs. {product.price}</div>
           {product.compare_at_price && (
             <div style={{ color: "#aaa", textDecoration: "line-through", fontSize: 36 }}>Rs. {product.compare_at_price}</div>
           )}
           <div style={{ width: 12, height: 12, background: "#ffb347", borderRadius: "50%", marginLeft: 16, marginRight: 16 }} />
           <div style={{ letterSpacing: 2, fontSize: 32, opacity: 0.9 }}>DIY IN 5 MINS</div>
        </div>
      </div>
    ),
    { ...size }
  );
}