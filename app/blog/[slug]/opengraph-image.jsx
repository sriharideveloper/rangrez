import { ImageResponse } from "next/og";
import { getBlogBySlug } from "../../../lib/supabase/blogs";

export const runtime = "edge";
export const alt = "Rangrez Henna Blog Story";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }) {
  let blog = null;
  try {
    const { slug } = await params;
    blog = await getBlogBySlug(slug);
  } catch (err) {
    console.error("Error fetching blog for OG image:", err);
  }

  if (!blog) {
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
          fontFamily: "system-ui, sans-serif",
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "flex-end",
          backgroundColor: "#111",
          backgroundImage: `linear-gradient(to bottom, transparent, rgba(17,17,17,0.8), #111), url(${blog.featured_image || "https://www.rangrezstencils.in/images/hero-henna.png"})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          padding: "60px",
          color: "white",
        }}
      >
        <div style={{ position: "absolute", top: 60, left: 60, display: "flex", alignItems: "center", gap: 20 }}>
           <div style={{ width: 80, height: 80, background: "rgba(164,74,63,0.9)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, fontWeight: 900 }}>R</div>
           <div style={{ fontSize: 28, fontWeight: 900, letterSpacing: 5 }}>RANGREZ TEA TIME</div>
        </div>

        <div style={{ position: "absolute", top: 60, right: 60, background: "#ffb347", color: "#111", padding: "10px 40px", borderRadius: 100, fontSize: 32, fontWeight: 800, transform: "rotate(5deg)" }}>
          READ & WEEP (JOY)
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 20 }}>
           {blog.tags?.length > 0 ? blog.tags.map(t => (
             <div key={t} style={{ fontSize: 24, background: "rgba(164,74,63,0.9)", padding: "10px 24px", borderRadius: 100, fontWeight: 800, textTransform: "uppercase" }}>{`#${t}`}</div>       
           )) : (
             <div style={{ fontSize: 24, background: "rgba(164,74,63,0.9)", padding: "10px 24px", borderRadius: 100, fontWeight: 800, textTransform: "uppercase" }}>#MALABARMAGIC</div>
           )}
        </div>

        <div style={{ fontSize: 84, fontWeight: 900, lineHeight: 1.1, textTransform: "uppercase", marginBottom: 30, maxWidth: "1000px", textShadow: "0 10px 20px rgba(0,0,0,0.8)" }}>
          {blog.title}
        </div>

        <div style={{ fontSize: 32, opacity: 0.9, display: "flex", alignItems: "center", gap: 16 }}>
           <div style={{ color: "#ffb347", fontWeight: "bold" }}>Words by:</div>
           <div style={{ fontWeight: 800 }}>{blog.author || "A Desi Auntie with Tea"}</div>
           <div style={{ width: 12, height: 12, background: "#ffb347", borderRadius: "50%" }} />
           <div style={{ letterSpacing: 2 }}>5 MINUTE READ OR LESS</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
