"use client";
﻿import Image from "next/image";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { 
  ArrowRight, Sparkles, ShieldCheck, Star, Zap, 
  MapPin, Heart, Coffee, CheckCircle2 
} from "lucide-react";

import dynamic from "next/dynamic";

// Components
import SplitText from "../components/SplitText";
import ScrollFloat from "../components/ScrollFloat";
import SpotlightCard from "../components/SpotlightCard";

const InstagramReels = dynamic(() => import("../components/InstagramReels"), { 
  ssr: false,
  loading: () => <div style={{ height: "400px", background: "var(--cl-surface)", animate: "pulse 2s infinite" }} />
});

// Bits UI
const ClickSpark = dynamic(() => import("../components/bits/ClickSpark"), { ssr: false });
const CircularText = dynamic(() => import("../components/bits/CircularText"), { ssr: false });
const ScrollVelocity = dynamic(() => import("../components/bits/ScrollVelocity"), { ssr: false });

// Data
import { getFeaturedProducts } from "../lib/supabase/products";
import { getLatestReviews } from "../lib/supabase/engagement";

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const { scrollY } = useScroll();
  const yBg = useTransform(scrollY, [0, 1000], [0, 300]);

  useEffect(() => {
    async function loadData() {
      const [prods, reviews] = await Promise.all([
        getFeaturedProducts(),
        getLatestReviews(6)
      ]);
      setFeatured(prods);
      setTestimonials(reviews);
    }
    loadData();
  }, []);

  return (
    <ClickSpark sparkColor="var(--cl-primary)" sparkCount={10} sparkSize={8}>
      <div style={{ background: "var(--cl-bg)", color: "var(--cl-text)", overflowX: "hidden" }}>
        
        {/* ═══ ELITE HERO SECTION ═══ */}
        <section style={{ minHeight: "90dvh", display: "flex", flexDirection: "column", justifyContent: "center", position: "relative", padding: "3rem 2rem", overflow: "hidden" }}>
          
          {/* Parallax & Decorative Elements */}
          <motion.div style={{ y: yBg, position: "absolute", top: "5%", right: "-10%", width: "50vw", height: "50vw", background: "radial-gradient(circle, rgba(164, 74, 63, 0.08) 0%, transparent 70%)", borderRadius: "50%", zIndex: 0 }} />
          
          <div className="arabic-decor" style={{ top: "10%", right: "2%", opacity: 0.02, fontSize: "15rem" }}>فخامة</div>

          <div style={{ maxWidth: "1400px", margin: "0 auto", width: "100%", position: "relative", zIndex: 2 }}>
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "2.5rem" }}>
              
              <div style={{ flex: "1 1 600px" }}>
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem" }}>
                  <span style={{ 
                    fontSize: "0.7rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "2px", 
                    padding: "0.6rem 1.4rem", border: "var(--border-thin)", borderRadius: "100px", 
                    background: "var(--cl-surface)", color: "var(--cl-text)"
                  }}>
                    Kochi Origin • Modern Precision
                  </span>
                  <div style={{ height: "1px", width: "30px", background: "var(--cl-primary)" }} />
                </motion.div>

                <h1 className="title-massive title-massive--glow" style={{ fontSize: "clamp(2.5rem, 7vw, 5.2rem)", lineHeight: "1.05", letterSpacing: "-0.04em", cursor: "default", willChange: "transform, opacity" }}>
                  <SplitText text="MALABAR MAGIC." delay={0.1} />
                  <br />
                  <span style={{ color: "var(--cl-primary)" }}>
                    <SplitText text="DIY HENNA STENCILS." delay={0.2} />
                  </span>
                </h1>

                <motion.p 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: 0.8 }}
                  style={{ fontSize: "1.15rem", maxWidth: "500px", margin: "1.5rem 0", fontWeight: 400, lineHeight: 1.4, opacity: 0.7 }}
                >
                  Stop fighting with shaky cones like it's a board exam. 
                  Get a bridal look in 2 minutes with laser-cut Malabar precision. 
                  <span style={{ fontWeight: 700, color: "var(--cl-text)" }}> High-quality stencils for the modern Malayali soul.</span>
                  </motion.p>
                  
                  <motion.div 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                    style={{ marginBottom: "2rem", display: "inline-flex", alignItems: "center", gap: "0.8rem", background: "var(--cl-surface)", padding: "0.6rem 1.2rem", borderRadius: "50px", border: "1px solid rgba(0,0,0,0.1)" }}>
                    <div style={{ display: "flex" }}>
                       <div style={{ width: "26px", height: "26px", borderRadius: "50%", background: "var(--cl-accent)", border: "2px solid var(--cl-bg)" }} />
                       <div style={{ width: "26px", height: "26px", borderRadius: "50%", background: "var(--cl-primary)", border: "2px solid var(--cl-bg)", marginLeft: "-10px" }} />
                       <div style={{ width: "26px", height: "26px", borderRadius: "50%", background: "var(--cl-text)", border: "2px solid var(--cl-bg)", marginLeft: "-10px", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--cl-bg)", fontSize: "0.5rem", fontWeight: "bold" }}>+</div>
                    </div>
                    <span style={{ fontSize: "0.85rem", fontWeight: 600, letterSpacing: "0.03em" }}>400+ HAPPY CUSTOMERS</span>
                  </motion.div>

                <div style={{ display: "flex", flexWrap: "wrap", gap: "2rem", alignItems: "center" }}>
                  <Link href="/shop" className="brutalist-button" style={{ padding: "1.6rem 4.5rem", fontSize: "1.2rem", background: "var(--cl-primary)", color: "#fff" }}>
                    Shop the Stencils <ArrowRight size={24} />
                  </Link>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <span style={{ fontWeight: 800, fontSize: "1.1rem" }}>2-Min Magic</span>
                    <span style={{ opacity: 0.5, fontSize: "0.8rem", textTransform: "uppercase" }}>Quick & High Quality</span>
                  </div>
                </div>
              </div>

              {/* Hero Image / Visual Clarity */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }} 
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  style={{ flex: "1 1 400px", position: "relative", height: "500px", borderRadius: "var(--radius-lg)", overflow: "hidden", border: "var(--border-thick)", boxShadow: "15px 15px 0 var(--cl-text)", willChange: "transform, opacity" }}
                >
                <Image 
                  src="/images/hero-henna.png" 
                  alt="Henna Stencil Application" 
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                  style={{ objectFit: "cover" }}
                />
                
                {/* 2-Min Magic Badge Overlay */}
                <motion.div 
                  initial={{ scale: 0 }} 
                  animate={{ scale: 1 }} 
                  transition={{ delay: 1.2, type: "spring" }}
                  style={{ 
                    position: "absolute", top: "2rem", left: "2rem", background: "var(--cl-primary)", 
                    color: "#fff", padding: "1rem 1.5rem", borderRadius: "100px", fontWeight: 900,
                    fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "2px",
                    boxShadow: "0 10px 20px rgba(164, 74, 63, 0.3)", zIndex: 10
                  }}
                >
                  <Sparkles size={14} style={{ marginRight: "8px", verticalAlign: "middle" }} />
                  2-Min Magic
                </motion.div>
                {/* Decorative Circular Text Overlay */}
                <div style={{ position: "absolute", bottom: "2rem", right: "-2rem", transform: "rotate(-15deg)", opacity: 0.9, background: "var(--cl-bg)", border: "var(--border-thin)", padding: "1.5rem", borderRadius: "50%" }}>
                  <CircularText 
                    text="* KOCHI ORIGIN * ARAB FINESSE * MALABAR SOUL " 
                    spinDuration={25} 
                    onHover="speedUp"
                  />
                </div>
              </motion.div>

            </div>
          </div>
        </section>

        {/* ═══ MARQUEE VELOCITY SECTION ═══ */}
        <section style={{ background: "var(--cl-text)", color: "var(--cl-bg)", padding: "2.5rem 0", borderTop: "var(--border-thick)", borderBottom: "var(--border-thick)" }}>
          <ScrollVelocity 
            texts={["Laser Precision", "Medical Grade Adhesive", "Kochi Minimal", "Artisan Quality"]}
            velocity={20}
            className="velocity-text"
            scrollerStyle={{ fontSize: "5rem", letterSpacing: "-0.05em" }}
          />
        </section>

        {/* ═══ KOCHI VIBES / ABOUT ═══ */}
        <section style={{ padding: "var(--section-padding) 2rem", background: "var(--cl-surface)", position: "relative", overflow: "hidden" }}>
          <div className="arabic-decor" style={{ bottom: "-5%", left: "5%", transform: "rotate(-15deg)", opacity: 0.02 }}>روح مالابار</div>
          
          <div style={{ maxWidth: "1400px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "6rem", position: "relative", zIndex: 1 }}>
             <div>
                <p className="text-label" style={{ color: "var(--cl-primary)", marginBottom: "1.5rem" }}>Rooted in Culture</p>
                <h2 className="title-massive" style={{ fontSize: "clamp(3rem, 6vw, 5rem)", lineHeight: 1, marginBottom: "2rem" }}>
                   DIY Mastery, <br /> Kochi Speed.
                </h2>
                <p style={{ fontSize: "1.15rem", opacity: 0.7, lineHeight: 1.8 }}>
                   We didn't start in a boardroom. We started on a Kochi porch with a vision to make complex henna accessible to everyone. 
                   No professional training needed—just peel, paste, and paint. 
                   Today, we blend surgical-grade materials with traditional Arab aesthetics for the ultimate DIY experience.
                </p>
             </div>
             <div style={{ display: "grid", gap: "3rem" }}>
                {[
                  { icon: <MapPin />, title: "The Kochi Hub", desc: "Hand-crafted and quality checked in the heart of Kerala's artisan capital." },
                  { icon: <Coffee />, title: "Arab Finesse", desc: "Inspired by the fluid geometry of Middle Eastern art, tailored for your skin." },
                  { icon: <CheckCircle2 />, title: "Laser Precise", desc: "No shaky lines. Just crisp, professional results in under 10 minutes." }
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: "1.5rem" }}>
                     <div style={{ minWidth: "60px", height: "60px", borderRadius: "50%", background: "var(--cl-bg)", border: "var(--border-thin)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--cl-primary)" }}>
                        {item.icon}
                     </div>
                     <div>
                        <h4 style={{ fontWeight: 800, fontSize: "1.2rem", marginBottom: "0.5rem" }}>{item.title}</h4>
                        <p style={{ opacity: 0.6, fontSize: "0.95rem" }}>{item.desc}</p>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        </section>

        {/* ═══ TRENDING PRODUCTS ═══ */}
        {featured.length > 0 && (
          <section style={{ padding: "var(--section-padding) 2rem", background: "var(--cl-bg)" }}>
            <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "5rem" }}>
                <div>
                  <h2 className="title-section">The DIY Stencil Drop</h2>
                  <p style={{ opacity: 0.5, marginTop: "1rem" }}>Limited editions & community favorites.</p>
                </div>
                <Link href="/shop" style={{ fontWeight: 800, fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "0.1em", borderBottom: `2px solid var(--cl-text)`, paddingBottom: "5px" }}>
                  View the Vault
                </Link>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "2.5rem" }}>
                {featured.map((p, i) => (
                  <motion.div key={p.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                    <SpotlightCard>
                      <Link href={`/shop/${p.slug}`} style={{ display: "block", textDecoration: "none" }}>
                        <div className="product-card" style={{ border: "var(--border-thick)" }}>
                          <div className="product-card__image" style={{ height: "450px", position: "relative" }}>
                            <Image 
                              src={p.image_url} 
                              alt={p.title} 
                              fill 
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              style={{ objectFit: "cover" }}
                              loading={i < 3 ? "eager" : "lazy"}
                              priority={i < 3}
                            />
                          </div>
                          <div className="product-card__body" style={{ padding: "2rem" }}>
                            <div style={{ flex: 1 }}>
                              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                                <Zap size={12} fill="var(--cl-primary)" stroke="none" />
                                <span style={{ fontSize: "0.65rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--cl-primary)" }}>
                                  {p.category} COLLECTION
                                </span>
                              </div>
                              <h3 className="product-card__title" style={{ fontSize: "1.6rem" }}>{p.title}</h3>
                            </div>
                            <div className="product-card__price">
                              <span className="product-card__price-current" style={{ fontSize: "1.6rem" }}>₹{p.price}</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </SpotlightCard>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ═══ COMMUNITY SOCIAL WALL (PREVIEWS) ═══ */}
        <section style={{ borderTop: "var(--border-thick)", borderBottom: "var(--border-thick)" }}>
           <InstagramReels />
        </section>

        {/* ═══ TESTIMONIALS (VIA ADMIN) ═══ */}
        {testimonials.length > 0 && (
          <section style={{ padding: "var(--section-padding) 2rem", background: "var(--cl-surface)", position: "relative" }}>
             <div className="arabic-decor" style={{ top: "0", right: "10%", opacity: 0.02 }}>شهادات</div>
             
             <div style={{ maxWidth: "1400px", margin: "0 auto", position: "relative", zIndex: 1 }}>
                <header style={{ marginBottom: "6rem", textAlign: "center" }}>
                   <h2 className="title-large">Verified Gossip</h2>
                   <p style={{ opacity: 0.5, marginTop: "1rem" }}>What the community is actually saying.</p>
                </header>
                <div style={{ overflow: "hidden", display: "flex", width: "100%", paddingBottom: "2rem" }}>
                   <motion.div
                      animate={{ x: ["0%", "-50%"] }}
                      transition={{ ease: "linear", duration: testimonials.length * 5 || 20, repeat: Infinity }}
                      style={{ display: "flex", gap: "2rem", width: "max-content", paddingRight: "2rem" }}
                   >
                     {[...testimonials, ...testimonials].map((t, i) => (
                       <div
                          key={i}
                          style={{ flex: "0 0 320px", padding: "2.5rem", background: "var(--cl-bg)", border: "var(--border-thin)", borderRadius: "var(--radius-lg)", display: "flex", flexDirection: "column" }}
                       >
                          <div style={{ display: "flex", gap: "2px", marginBottom: "1.5rem" }}>
                             {[...Array(t.rating)].map((_, idx) => <Star key={`star-${i}-${idx}`} size={14} fill="var(--cl-accent)" strokeWidth={0} />)}
                          </div>
                          <p style={{ fontSize: "1rem", lineHeight: 1.6, fontStyle: "italic", marginBottom: "2rem", flex: 1 }}>"{t.content}"</p>
                          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginTop: "auto" }}>
                             {t.avatar_url ? (
                               <Image src={t.avatar_url} alt={t.name || "Avatar"} width={32} height={32} style={{ borderRadius: "50%", objectFit: "cover" }} unoptimized />
                             ) : (
                               <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "var(--cl-primary)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "0.7rem" }}>
                                  {t.name?.[0]}
                               </div>
                             )}
                             <div>
                                <p style={{ fontWeight: 800, fontSize: "0.85rem" }}>{t.name}</p>
                                <p style={{ fontSize: "0.7rem", opacity: 0.5 }}>{t.role || "Artisan Client"}</p>
                             </div>
                          </div>
                       </div>
                     ))}
                   </motion.div>
                </div>
             </div>
          </section>
        )}

        {/* ═══ FINAL CTA ═══ */}
        <section style={{ padding: "var(--section-padding) 2rem", textAlign: "center", background: "var(--cl-text)", color: "var(--cl-bg)", position: "relative", overflow: "hidden" }}>
           <div className="arabic-decor" style={{ top: "10%", left: "50%", transform: "translateX(-50%)", color: "var(--cl-primary)", opacity: 0.1 }}>تسوق الآن</div>
           
           <div style={{ maxWidth: "900px", margin: "0 auto", position: "relative", zIndex: 2 }}>
              <div style={{ position: "absolute", top: "-100px", left: "50%", transform: "translateX(-50%)" }}>
                 <CircularText text="* WEARABLE ART * KOCHI VIBES * KOCHI VIBES " spinDuration={15} />
              </div>
              <h2 className="title-massive title-massive--glow" style={{ fontSize: "clamp(3rem, 10vw, 8rem)", color: "#fff" }}>BECOME THE <br /> CANVAS.</h2>
              <p style={{ fontSize: "1.4rem", opacity: 0.6, margin: "3rem 0 4rem", lineHeight: 1.5 }}>
                 Stop hesitating. Join 5,000+ artists and elevate your craft today. 
                 Shipping daily from our Kochi studio.
              </p>
              <Link href="/shop" className="brutalist-button" style={{ padding: "1.8rem 6rem", fontSize: "1.2rem", background: "var(--cl-primary)", border: "none", color: "#fff", boxShadow: "10px 10px 0 rgba(255,255,255,0.2)" }}>
                  Join the Vault ✦ Visit Shop
              </Link>
           </div>
        </section>

      </div>
    </ClickSpark>
  );
}


