"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Calendar, User, Tag } from "lucide-react";
import { getAllBlogs } from "../../lib/supabase/blogs";

export default function BlogListingPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await getAllBlogs();
      setBlogs(data);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div style={{ background: "var(--cl-bg)", color: "var(--cl-text)", minHeight: "100vh" }}>
      
      {/* ═══ BLOG HERO ═══ */}
      <section style={{ padding: "8rem 2rem 4rem", position: "relative", overflow: "hidden" }}>
        <div className="arabic-decor" style={{ top: "10%", right: "5%", opacity: 0.05, fontSize: "12rem" }}>ملايار</div>
        
        <div style={{ maxWidth: "1400px", margin: "0 auto", position: "relative", zIndex: 2 }}>
          <header style={{ marginBottom: "6rem" }}>
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
               <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem", opacity: 0.5, marginBottom: "2rem", color: "var(--cl-text)" }}>
                  <ArrowLeft size={16} /> Home
               </Link>
               <h1 className="title-massive" style={{ fontSize: "clamp(4rem, 12vw, 10rem)", lineHeight: "0.9" }}>THE <br /> VAULT.</h1>
               <p style={{ fontSize: "1.4rem", maxWidth: "600px", marginTop: "2rem", opacity: 0.6, lineHeight: 1.5 }}>
                 Crafted stories, DIY secrets, and Malabar traditions. 
                 A digital journal for the modern Rangrez.
               </p>
            </motion.div>
          </header>

          {loading ? (
             <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))", gap: "3rem" }}>
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="pulse" style={{ background: "var(--cl-surface)", height: "500px", border: "var(--border-thick)" }} />
                ))}
             </div>
          ) : blogs.length === 0 ? (
            <div style={{ padding: "6rem 0", textAlign: "center", border: "var(--border-thin)", background: "var(--cl-surface)" }}>
                <p style={{ opacity: 0.5, fontSize: "1.2rem" }}>The vault is currently empty. Check back soon!</p>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))", gap: "4rem" }}>
              {blogs.map((blog, i) => (
                <motion.article 
                  key={blog.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="blog-card"
                  style={{ position: "relative" }}
                >
                  <Link href={`/blog/${blog.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
                    <div style={{ 
                      height: "450px", position: "relative", marginBottom: "2.5rem", 
                      border: "var(--border-thick)", overflow: "hidden",
                      transition: "transform 0.4s ease"
                    }} className="blog-card__image-wrap">
                      <Image 
                        src={blog.featured_image || "/images/hero-henna.png"} 
                        alt={blog.title} 
                        fill 
                        style={{ objectFit: "cover" }}
                      />
                      <div style={{ position: "absolute", bottom: "1.5rem", right: "1.5rem", background: "var(--cl-bg)", border: "var(--border-thin)", padding: "0.8rem 1.2rem", fontWeight: 800, fontSize: "0.75rem", textTransform: "uppercase" }}>
                        Read Story
                      </div>
                    </div>
                    
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "1.5rem", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", opacity: 0.5, letterSpacing: "2px" }}>
                        <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}><Calendar size={14} /> {new Date(blog.published_at).toLocaleDateString()}</span>
                        <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}><User size={14} /> {blog.author || "Rangrez Team"}</span>
                      </div>
                      
                      <h2 className="title-section" style={{ fontSize: "2.2rem", marginBottom: "1.5rem", lineHeight: 1.1 }}>{blog.title}</h2>
                      
                      <p style={{ fontSize: "1.05rem", opacity: 0.6, lineHeight: 1.7, marginBottom: "2rem", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                        {blog.excerpt || "Dive into the intricate world of Malabar henna and DIY stencils..."}
                      </p>
                      
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
                         {blog.tags?.map(tag => (
                           <span key={tag} style={{ fontSize: "0.65rem", padding: "0.4rem 1rem", border: "1px solid var(--cl-muted)", borderRadius: "100px", opacity: 0.7 }}>
                             #{tag}
                           </span>
                         ))}
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>

    </div>
  );
}
