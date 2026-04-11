"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, ArrowUpRight, Play } from "lucide-react";
import { INSTAGRAM_REELS } from "../lib/mockData";

function ReelCard({ url, index }) {
  const [loadIframe, setLoadIframe] = useState(false);
  
  // Extract reel ID
  const reelId = url.split("/reel/")[1]?.replace("/", "") || url.split("/p/")[1]?.replace("/", "") || "";
  
  // High-res Thumbnail Engine
  const thumbnailUrl = `https://www.instagram.com/reel/${reelId}/media/?size=l`;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ 
        opacity: 1, 
        scale: 1,
        // Auto-load once the card is 50% visible
        transition: { duration: 0.6 }
      }}
      onViewportEnter={() => {
        // Delay slightly for staggered loading feel
        setTimeout(() => setLoadIframe(true), index * 200);
      }}
      viewport={{ once: true, amount: 0.5 }}
      style={{
        position: "relative",
        aspectRatio: "9/16",
        background: "var(--cl-muted)", // Warmer placeholder
        borderRadius: "var(--radius-lg)",
        overflow: "hidden",
        border: "var(--border-thin)",
        cursor: "pointer",
        boxShadow: "var(--shadow-brutal-sm)",
        transition: "var(--transition-smooth)",
      }}
    >
      {!loadIframe ? (
        <div style={{ width: "100%", height: "100%", position: "relative" }}>
          {/* Instant High-Res Cover */}
          <img 
            src={thumbnailUrl} 
            alt="Reel Cover"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          
          <div style={{ 
            position: "absolute", inset: 0, 
            background: "linear-gradient(to top, rgba(42,31,26,0.8), transparent)",
            zIndex: 3, display: "flex", alignItems: "center", justifyContent: "center"
          }}>
             <motion.div 
               animate={{ scale: [1, 1.1, 1] }}
               transition={{ repeat: Infinity, duration: 2 }}
               style={{ 
                 width: "60px", height: "60px", background: "rgba(255,255,255,0.1)", 
                 borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                 backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.2)",
               }}
             >
               <Play fill="white" color="white" size={24} style={{ marginLeft: "4px" }} />
             </motion.div>
          </div>
        </div>
      ) : (
        <div style={{ width: "100%", height: "100%", position: "relative" }}>
          {/* REFINED GHOST MASKING: 
              - No zoom (scale 1)
              - Precise 60px clipping
          */}
          <div style={{
             width: "100%", height: "100%", 
             position: "absolute", top: 0, left: 0,
             overflow: "hidden"
          }}>
            <iframe
              src={`https://www.instagram.com/reel/${reelId}/embed/captioned/`}
              scrolling="no"
              style={{ 
                width: "calc(100% + 40px)", 
                height: "calc(100% + 120px)", // Adjusted
                border: "none",
                marginTop: "-60px", // Precise header clip
                marginLeft: "-20px", 
                borderRadius: "var(--radius-lg)",
                overflow: "hidden"
              }}
              allow="autoplay"
              title={`Instagram Reel ${index}`}
            />
          </div>
          
          {/* Premium Native Indicator */}
          <div style={{ 
             position: "absolute", top: "1rem", left: "1rem", 
             background: "var(--cl-primary)", color: "#fff", 
             padding: "0.4rem 0.8rem", borderRadius: "100px", 
             fontSize: "0.6rem", fontWeight: 800, pointerEvents: "none",
             letterSpacing: "1px", zIndex: 10
          }}>
             LIVE PREVIEW
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default function InstagramReels() {
  const [displayCount, setDisplayCount] = useState(8);
  const reels = INSTAGRAM_REELS;

  useEffect(() => {
    if (window.innerWidth <= 768) {
      setDisplayCount(3);
    }
  }, []);

  return (
    <section style={{ padding: "var(--section-padding) 2rem", background: "var(--cl-bg)", position: "relative", overflow: "hidden" }}>
      {/* Background Decorative Text */}
      <div className="arabic-decor" style={{ top: "10%", left: "5%", transform: "rotate(-5deg)" }}>عناية</div>
      <div className="arabic-decor" style={{ bottom: "10%", right: "2%", transform: "rotate(10deg)" }}>فن</div>

      <div style={{ maxWidth: "1400px", margin: "0 auto", position: "relative", zIndex: 2 }}>
        <header style={{ marginBottom: "5rem", textAlign: "center" }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem", marginBottom: "1.5rem" }}>
              <div style={{ height: "1px", width: "40px", background: "var(--cl-primary)" }} />
               <p className="text-label" style={{ color: "var(--cl-primary)", letterSpacing: "4px" }}>
                  The DIY Revolution
              </p>
              <div style={{ height: "1px", width: "40px", background: "var(--cl-primary)" }} />
            </div>
            
            <h2 className="title-massive title-massive--glow" style={{ fontSize: "clamp(3.5rem, 10vw, 9rem)", marginBottom: "1rem" }}>
               Mastery <br /> In Motion
             </h2>
            <div className="text-arabic" style={{ fontSize: "2rem", opacity: 0.3, marginTop: "-1rem" }}>
              معرض الإلهام الحقيقي
            </div>
          </motion.div>
        </header>

        {/* Masonry-ish Grid with improved gaps */}
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", 
          gap: "3rem",
          paddingBottom: "5rem"
        }}>
          {reels.slice(0, displayCount).map((url, i) => (
            <ReelCard key={i} url={url} index={i} />
          ))}
        </div>

        {displayCount < reels.length && (
          <div style={{ textAlign: "center", marginTop: "2rem" }}>
            <button 
              onClick={() => setDisplayCount(prev => prev + 12)}
              className="brutalist-button"
              style={{ padding: "1.4rem 4rem", fontSize: "1rem", borderRadius: "100px" }}
            >
               Explore DIY Magic
             </button>
          </div>
        )}
      </div>
    </section>
  );
}
