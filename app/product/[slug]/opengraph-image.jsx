import { ImageResponse } from "next/og";
import { getProductBySlug } from "../../../lib/supabase/products";

export const runtime = "edge";
export const alt = "Rangrez Henna Product Preview";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return new ImageResponse(
      (
        <div style={{ background: "#A44A3F", width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 100, fontWeight: "bold" }}>
          RANGREZ
        </div>
      ),
      { ...size }
    );
  }

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          backgroundColor: "#FDFCFB",
          color: "#111",
          fontFamily: "sans-serif",
          padding: 0,
          margin: 0,
        }}
      >
        {/* Left Side: Text and Branding */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "60px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div style={{ width: 60, height: 60, background: "#A44A3F", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 32, fontWeight: 900 }}>R</div>
            <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: 4, color: "#A44A3F" }}>RANGREZ HENNA</div>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: "#A44A3F", marginBottom: 20 }}>MALABAR MAGIC • DIY</div>
            <div style={{ fontSize: 80, fontWeight: 900, lineHeight: 1, textTransform: "uppercase", marginBottom: 20 }}>{product.name}</div>
            <div style={{ fontSize: 48, fontWeight: 900 }}>₹{product.price}</div>
          </div>

          <div style={{ fontSize: 24, opacity: 0.6 }}>Professional DIY Stencils from Kochi</div>
        </div>

        {/* Right Side: Product Image with brutalist border */}
        <div style={{ flex: 1, position: "relative", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px" }}>
           <div style={{ 
             width: "100%", 
             height: "100%", 
             display: "flex",
             border: "12px solid #111", 
             boxShadow: "20px 20px 0px #A44A3F",
             overflow: "hidden"
            }}>
             <img 
               src={product.images?.[0] || "https://rangrez-henna.com/images/hero-henna.png"} 
               style={{ width: "100%", height: "100%", objectFit: "cover" }} 
             />
           </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
