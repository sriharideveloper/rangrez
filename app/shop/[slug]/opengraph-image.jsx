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
          RANGREZ MAGIC
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
          backgroundColor: "#111",
          color: "#fff",
          fontFamily: "system-ui, sans-serif",
          padding: 0,
          margin: 0,
          backgroundImage: "radial-gradient(circle at 10% 90%, #4a1510 0%, #111 60%)"
        }}
      >
        {/* Left Side: Text and Branding */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "60px 40px 60px 60px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>      
            <div style={{ width: 60, height: 60, background: "#A44A3F", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 32, fontWeight: 900 }}>R</div>
            <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: 4, color: "#fff" }}>RANGREZ HENNA</div>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <div style={{ background: "#ffb347", color: "#111", padding: "6px 16px", borderRadius: 100, fontSize: 20, fontWeight: 800 }}>DIY MALABAR MAGIC</div>
              <div style={{ background: "#A44A3F", color: "#fff", padding: "6px 16px", borderRadius: 100, fontSize: 20, fontWeight: 800, transform: "rotate(-5deg)" }}>SALE</div>
            </div>
            
            <div style={{ fontSize: 76, fontWeight: 900, lineHeight: 1.05, textTransform: "uppercase", marginBottom: 20, color: "#fff" }}>{product.name}</div>
            
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <div style={{ fontSize: 56, fontWeight: 900, color: "#ffb347" }}>Rs. {product.price}</div>
              {product.compare_at_price && (
                 <div style={{ fontSize: 32, fontWeight: 700, textDecoration: "line-through", color: "#666" }}>Rs. {product.compare_at_price}</div>
              )}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", fontSize: 28, opacity: 0.8, color: "#aaa", lineHeight: 1.4 }}>
            <div>Stop paying Rs. 5000.</div>
            <div>Do it yourself in 5 mins.</div>
          </div>
        </div>

        {/* Right Side: Product Image with brutalist border */}
        <div style={{ flex: 1, position: "relative", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px" }}>
           <div style={{
             width: "100%",
             height: "100%",
             display: "flex",
             border: "12px solid #ffb347",
             boxShadow: "-20px 20px 0px #A44A3F",
             overflow: "hidden",
             borderRadius: 20
            }}>
             <img
               src={product.images?.[0] || product.image_url || "https://rangrez-henna.com/images/hero-henna.png"}
               style={{ width: "100%", height: "100%", objectFit: "cover" }}    
             />
           </div>
           
           <div style={{ position: "absolute", bottom: 60, right: 20, display: "flex", background: "#fff", color: "#111", padding: "10px 20px", borderRadius: 100, fontSize: 32, fontWeight: 900, transform: "rotate(-10deg)", boxShadow: "0 10px 20px rgba(0,0,0,0.5)"}}>
             BRIDE APPROVED 💅
           </div>
        </div>
      </div>
    ),
    { ...size }
  );
}