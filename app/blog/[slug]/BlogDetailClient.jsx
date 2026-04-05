"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useSpring } from "framer-motion";
import { ArrowLeft, Calendar, User, Share2, Tag, Bookmark, ShoppingBag, ArrowRight } from "lucide-react";

// Interactive Product Mini-Card for @mentions
function ProductMention({ slug }) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/products/${slug}`);
        if (!res.ok) throw new Error("Not found");
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        console.error("Failed to fetch product mention:", slug);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [slug]);

  if (loading) return <div className="pulse" style={{ height: "100px", background: "var(--cl-surface)", margin: "2rem 0", border: "var(--border-thin)" }} />;
  if (!product) return null;

  return (
    <div style={{ margin: "3rem 0" }}>
      {mounted && (
        <motion.div 
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          style={{ 
            padding: "1.5rem", 
            border: "var(--border-thick)", background: "var(--cl-surface)",
            display: "flex", gap: "1.5rem", alignItems: "center",
            boxShadow: "10px 10px 0px var(--cl-text)"
          }}
        >
          <div style={{ width: "100px", height: "100px", position: "relative", border: "var(--border-thin)", overflow: "hidden" }}>
            <Image src={product.images?.[0] || "/images/hero-henna.png"} alt={product.name || "Featured Product"} fill style={{ objectFit: "cover" }} />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: "0.7rem", fontWeight: 800, textTransform: "uppercase", color: "var(--cl-primary)", marginBottom: "0.25rem" }}>Featured Product</p>
            <h4 style={{ fontSize: "1.2rem", fontWeight: 900, textTransform: "uppercase", marginBottom: "0.5rem" }}>{product.name}</h4>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontWeight: 800 }}>₹{product.price}</span>
              <Link href={`/product/${product.slug || slug}`} style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem", fontWeight: 700, color: "var(--cl-text)" }}>
                 Shop Now <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </motion.div>
      )}
      {!mounted && (
        <div 
          style={{ 
            padding: "1.5rem", 
            border: "var(--border-thick)", background: "var(--cl-surface)",
            display: "flex", gap: "1.5rem", alignItems: "center",
            boxShadow: "10px 10px 0px var(--cl-text)"
          }}
        >
          <div style={{ width: "100px", height: "100px", position: "relative", border: "var(--border-thin)", overflow: "hidden" }}>
            <Image src={product.images?.[0] || "/images/hero-henna.png"} alt={product.name || "Featured Product"} fill style={{ objectFit: "cover" }} />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: "0.7rem", fontWeight: 800, textTransform: "uppercase", color: "var(--cl-primary)", marginBottom: "0.25rem" }}>Featured Product</p>
            <h4 style={{ fontSize: "1.2rem", fontWeight: 900, textTransform: "uppercase", marginBottom: "0.5rem" }}>{product.name}</h4>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontWeight: 800 }}>₹{product.price}</span>
              <Link href={`/product/${product.slug || slug}`} style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem", fontWeight: 700, color: "var(--cl-text)" }}>
                 Shop Now <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Refactored Content Renderer Component
function ContentRenderer({ content }) {
  if (!content) return null;

  const parts = useMemo(() => content.split(/(@\w+[\w-]*)/g), [content]);

  return parts.map((part, index) => {
    if (part.startsWith("@")) {
      const slug = part.substring(1);
      return <ProductMention key={index} slug={slug} />;
    }

    const html = part
      .replace(/^# (.*$)/gm, '<h1>$1</h1>')
      .replace(/^## (.*$)/gm, '<h2>$1</h2>')
      .replace(/^### (.*$)/gm, '<h3>$1</h3>')
      .replace(/\*\*(.*)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*)\*/g, '<em>$1</em>')
      .replace(/^\- (.*$)/gm, '<li>$1</li>')
      .replace(/\n\n/g, '<br/><br/>')
      .replace(/\!\[(.*?)\]\((.*?)\)/g, '<div class="md-img-wrap"><img src="$2" alt="$1"/></div>')
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>');

    return (
      <div 
        key={index} 
        dangerouslySetInnerHTML={{ __html: html }} 
        style={{ display: "inline" }} 
      />
    );
  });
}

// Scroll Progress Component for Safe Hydration
function ScrollProgress() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { 
    stiffness: 100, 
    damping: 30, 
    restDelta: 0.001 
  });

  if (!mounted) return null;

  return (
    <motion.div 
      style={{ 
        scaleX, 
        position: "fixed", 
        top: 0, 
        left: 0, 
        right: 0, 
        height: "6px", 
        background: "var(--cl-primary)", 
        zIndex: 100, 
        originX: 0 
      }} 
    />
  );
}

export default function BlogDetailClient({ blog }) {
  const handleShare = () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (navigator.share) {
      navigator.share({
        title: blog.title,
        text: blog.excerpt,
        url: url,
      });
    } else {
      navigator.clipboard.writeText(url);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <div style={{ background: "var(--cl-bg)", color: "var(--cl-text)", minHeight: "100vh" }}>
      <ScrollProgress />

      <section style={{ padding: "8rem 2rem 4rem", maxWidth: "1000px", margin: "0 auto" }}>
        <Link href="/blog" style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem", opacity: 0.5, marginBottom: "3rem", color: "var(--cl-text)" }}>
          <ArrowLeft size={16} /> Back to Vault
        </Link>
        
        <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
           {blog.tags?.map(t => <span key={t} style={{ fontSize: "0.7rem", fontWeight: 800, textTransform: "uppercase", color: "var(--cl-primary)", letterSpacing: "1px" }}>#{t}</span>)}
        </div>

        <h1 className="title-massive" style={{ fontSize: "clamp(3.5rem, 8vw, 7rem)", lineHeight: "0.95", marginBottom: "3rem" }}>{blog.title}</h1>
        
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--cl-muted)", borderBottom: "1px solid var(--cl-muted)", padding: "1.5rem 0" }}>
           <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
              <div style={{ width: "45px", height: "45px", borderRadius: "50%", background: "var(--cl-primary)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 900 }}>{blog.author?.[0] || 'R'}</div>
              <div>
                <p style={{ fontWeight: 800, fontSize: "0.9rem" }}>{blog.author || "Rangrez Team"}</p>
                <p style={{ fontSize: "0.75rem", opacity: 0.5 }}>{new Date(blog.published_at).toLocaleDateString()} • 5 min read</p>
              </div>
           </div>
           <div style={{ display: "flex", gap: "1.5rem" }}>
              <Share2 size={20} cursor="pointer" onClick={handleShare} style={{ opacity: 0.5, transition: "opacity 0.2s" }} onMouseEnter={(e) => e.target.style.opacity = 1} onMouseLeave={(e) => e.target.style.opacity = 0.5} />
              <Bookmark size={20} cursor="pointer" style={{ opacity: 0.5 }} />
           </div>
        </div>
      </section>

      <section style={{ maxWidth: "1400px", margin: "0 auto 6rem", padding: "0 2rem" }}>
        <div style={{ height: "700px", position: "relative", border: "var(--border-thick)", overflow: "hidden" }}>
           <Image src={blog.featured_image || "/images/hero-henna.png"} alt={blog.title} fill style={{ objectFit: "cover" }} priority />
        </div>
      </section>

      <article className="markdown-style" style={{ maxWidth: "800px", margin: "0 auto", padding: "0 2rem 10rem" }}>
         <div style={{ lineHeight: 1.8, fontSize: "1.15rem", opacity: 0.85 }}>
            <ContentRenderer content={blog.content} />
         </div>
         
         <div style={{ marginTop: "6rem", padding: "4rem", background: "var(--cl-surface)", border: "var(--border-thin)", textAlign: "center" }}>
            <h3 style={{ fontSize: "2rem", fontFamily: "var(--font-heading)", marginBottom: "1rem" }}>Enjoyed this story?</h3>
            <p style={{ opacity: 0.6, marginBottom: "2.5rem" }}>Share it with your sisters or join our DIY community in Kochi.</p>
            <div style={{ display: "flex", justifyContent: "center", gap: "2rem" }}>
               <button onClick={handleShare} className="brutalist-button" style={{ background: "var(--cl-primary)", color: "#fff" }}>Share Story</button>
               <Link href="/shop" className="brutalist-button">Shop Stencils</Link>
            </div>
         </div>
      </article>
    </div>
  );
}
