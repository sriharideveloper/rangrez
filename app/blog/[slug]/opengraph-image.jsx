import { ImageResponse } from "next/og";
import { getBlogBySlug } from "../../../lib/supabase/blogs";

export const runtime = "edge";
export const alt = "Rangrez Henna Blog Story";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) {
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
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "flex-end",
          backgroundColor: "#111",
          backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.8)), url(${blog.featured_image || "https://rangrez-henna.com/images/hero-henna.png"})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          padding: "60px",
          color: "white",
        }}
      >
        <div style={{ position: "absolute", top: 60, left: 60, display: "flex", alignItems: "center", gap: 20 }}>
           <div style={{ width: 60, height: 60, background: "#A44A3F", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, fontWeight: 900 }}>R</div>
           <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: 4 }}>RANGREZ HENNA</div>
        </div>
        
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 20 }}>
           {blog.tags?.map(t => (
             <div key={t} style={{ fontSize: 20, background: "#A44A3F", padding: "6px 16px", borderRadius: 4, fontWeight: 900 }}>#{t.toUpperCase()}</div>
           ))}
        </div>

        <div style={{ fontSize: 84, fontWeight: 900, lineHeight: 1.1, textTransform: "uppercase", marginBottom: 20, maxWidth: "900px" }}>
          {blog.title}
        </div>
        
        <div style={{ fontSize: 28, opacity: 0.8, display: "flex", alignItems: "center", gap: 12 }}>
           <span>{blog.author || "Rangrez Team"}</span>
           <div style={{ width: 10, height: 10, background: "#A44A3F", borderRadius: "50%" }} />
           <span>MALABAR MAGIC STORY</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
