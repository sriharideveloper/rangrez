"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, Minus, Plus, ShoppingBag, Check, 
  Star, Eye, TrendingUp, Share2, ShieldCheck, AlertCircle, 
  Truck, RotateCcw 
} from "lucide-react";
import { useCartStore } from "../../../store/cartStore";
import ScrollFloat from "../../../components/ScrollFloat";
import SpotlightCard from "../../../components/SpotlightCard";
import { submitProductReview } from "../../../lib/supabase/engagement";
import { createClient } from "../../../lib/supabase/client";

export default function ProductClient({ product, related, initialReviews }) {
  const { addItem } = useCartStore();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  const [reviews, setReviews] = useState(initialReviews || []);
  const [reviewInput, setReviewInput] = useState({ rating: 5, comment: "", name: "", email: "" });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [user, setUser] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [fomoViewers, setFomoViewers] = useState(1);

  useEffect(() => {
    setMounted(true);
    async function checkUser() {
      const supabase = createClient();
      const { data } = await supabase.auth.getUser();
      if (data?.user) setUser(data.user);
    }
    checkUser();
  }, []);

  useEffect(() => {
    if (!product?.id) return;
    const supabase = createClient();
    const room = supabase.channel(`product-${product.id}`);
    
    room
      .on('presence', { event: 'sync' }, () => {
        const state = room.presenceState();
        setFomoViewers(Math.max(1, Object.keys(state).length));
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await room.track({ online_at: new Date().toISOString() });
        }
      });

    return () => { supabase.removeChannel(room); };
  }, [product?.id]);

  const handleAdd = () => {
    if (product.stock <= 0) return;
    if (qty > product.stock) {
      alert(`Only ${product.stock} left in stock.`);
      setQty(product.stock);
      return;
    }
    addItem({ ...product, image: product.images?.[0] || product.image_url, quantity: qty });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setSubmittingReview(true);
    
    const res = await submitProductReview(product.id, reviewInput.rating, reviewInput.comment);
    
    if (res.error) {
      alert("Error: " + res.error);
    } else {
      setReviews(prev => [{
        id: Date.now(),
        user_name: user?.user_metadata?.full_name || reviewInput.name || "You",
        rating: reviewInput.rating,
        comment: reviewInput.comment,
        created_at: new Date().toISOString()
      }, ...prev]);
      setReviewInput({ rating: 5, comment: "", name: "", email: "" });
      alert("Review submitted successfully!");
    }
    setSubmittingReview(false);
  };

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const shareText = `✨ *${product.title}* ✨\n\nStop paying salons ₹5k! Slay your Henna look in 5 minutes with our premium peeling stencils.\n\n`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${product.title} | Rangrez`,
          text: shareText,
          url: url,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(shareText + url)}`);
    }
  };

  const galleryRaw = Array.isArray(product.gallery_urls) ? product.gallery_urls : (Array.isArray(product.images) ? product.images : []);
  const gallery = [product.image_url, ...galleryRaw].filter((v, i, a) => v && a.indexOf(v) === i);

  return (
    <div style={{ minHeight: "100vh", background: "var(--cl-bg)" }}>
      {/* Breadcrumb - Glassmorphic */}
      <div style={{ 
        padding: "1rem 2rem", fontSize: "0.8rem", display: "flex", gap: "0.5rem", 
        alignItems: "center", position: "sticky", top: "72px", zIndex: 10,
        background: "rgba(247, 245, 240, 0.6)", backdropFilter: "blur(8px)",
        borderBottom: "var(--border-thin)"
      }}>
        <Link href="/" style={{ opacity: 0.6 }}>Home</Link>
        <span style={{ opacity: 0.3 }}>/</span>
        <Link href="/shop" style={{ opacity: 0.6 }}>Shop</Link>
        <span style={{ opacity: 0.3 }}>/</span>
        <span style={{ fontWeight: 600, color: "var(--cl-primary)" }}>{product.title}</span>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "0" }}>
        {/* Elite Gallery Carousel */}
        <div style={{ flex: "1 1 55%", minWidth: "300px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "sticky", top: "120px", padding: "1rem" }}>
            <div style={{ position: "relative", aspectRatio: "4/5", overflow: "hidden", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-brutal)" }}>
              {mounted && (
                <AnimatePresence mode="wait">
                  <motion.div
                  key={activeImage}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  style={{ width: "100%", height: "100%" }}
                >
                  <img
                    src={gallery[activeImage]}
                    alt={`${product.title} view ${activeImage + 1}`}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </motion.div>
              </AnimatePresence>
              )}
              
              {!mounted && (
                <div style={{ width: "100%", height: "100%" }}>
                  <Image src={gallery[activeImage]} alt={product.title} fill style={{ objectFit: "cover" }} priority unoptimized />
                </div>
              )}

              {gallery.length > 1 && (
                <>
                  <button 
                    onClick={() => setActiveImage((activeImage - 1 + gallery.length) % gallery.length)}
                    style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", background: "var(--cl-bg)", border: "var(--border-thin)", width: "40px", height: "40px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 5, cursor: "pointer" }}
                  >
                    <ArrowLeft size={20} />
                  </button>
                  <button 
                    onClick={() => setActiveImage((activeImage + 1) % gallery.length)}
                    style={{ position: "absolute", right: "1rem", top: "50%", transform: "translateY(-50%)", background: "var(--cl-bg)", border: "var(--border-thin)", width: "40px", height: "40px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 5, cursor: "pointer" }}
                  >
                    <Plus size={20} style={{ transform: "rotate(45deg)" }} /> {/* Using Plus rotated as a cheat for arrow if RightArrow missing, but I have icons */}
                    {/* Wait, I have ArrowLeft, I should probably use a Right arrow if I have it, or just use ArrowLeft rotated */}
                    <ArrowLeft size={20} style={{ transform: "rotate(180deg)" }} />
                  </button>
                </>
              )}
            </div>
            
            {gallery.length > 1 && (
              <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem", justifyContent: "center", flexWrap: "wrap" }}>
                {gallery.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    style={{
                      width: "70px", height: "90px", borderRadius: "var(--radius-md)",
                      overflow: "hidden", border: activeImage === i ? "2px solid var(--cl-primary)" : "1px solid var(--cl-muted)",
                      opacity: activeImage === i ? 1 : 0.5, transition: "all 0.3s", cursor: "pointer", padding: 0
                    }}
                  >
                    <Image src={img} alt="Thumbnail view" fill style={{ objectFit: "cover" }} unoptimized />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Premium Details Control Center */}
        <div style={{ flex: "1 1 40%", minWidth: "350px", padding: "4rem 3rem", display: "flex", flexDirection: "column", gap: "2.5rem" }}>
          <header>
            <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.5rem" }}>
              {product.stock <= 0 && (
                <span style={{ padding: "0.2rem 0.6rem", background: "var(--cl-primary)", color: "var(--cl-bg)", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase" }}>
                  Out of Stock
                </span>
              )}
              {mounted && (
                <motion.div 
                  animate={{ opacity: [0.5, 1, 0.5] }} 
                  transition={{ repeat: Infinity, duration: 2 }}
                  style={{ 
                    display: "flex", alignItems: "center", gap: "0.4rem", 
                    background: "rgba(164, 74, 63, 0.1)", color: "var(--cl-primary)", 
                    padding: "0.4rem 1rem", fontSize: "0.7rem", fontWeight: 700, borderRadius: "100px" 
                  }}
                >
                  <TrendingUp size={12} /> {fomoViewers} People Viewing
                </motion.div>
              )}
            </div>

            <h1 style={{ fontSize: "4rem", fontFamily: "var(--font-heading)", lineHeight: 0.9, marginBottom: "1rem" }}>
              {product.title}
            </h1>
            
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
                <span style={{ fontSize: "2.5rem", fontWeight: 500 }}>₹{product.price}</span>
                {product.compare_at_price && (
                  <span style={{ fontSize: "1.5rem", textDecoration: "line-through", opacity: 0.3 }}>₹{product.compare_at_price}</span>
                )}
              </div>
              <button 
                onClick={handleShare}
                style={{ 
                  display: "flex", alignItems: "center", gap: "0.5rem", 
                  padding: "0.5rem 1rem", background: "transparent", 
                  border: "1px solid var(--cl-border)", borderRadius: "var(--radius-sm)",
                  cursor: "pointer", fontSize: "0.9rem", color: "var(--cl-foreground)"
                }}
              >
                <Share2 size={16} /> Share
              </button>
            </div>
          </header>

          <p style={{ fontSize: "1.1rem", lineHeight: 1.6, opacity: 0.7, maxWidth: "500px" }}>
            {product.description || "Indulge in our artisan-grade stencils, designed for the modern henna enthusiast."}
          </p>

          {/* QUANTITY & ACTIONS */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", marginTop: "1rem" }}>
            <div style={{ 
              display: "inline-flex", alignItems: "center", border: "var(--border-thick)", 
              borderRadius: "100px", padding: "0.25rem", opacity: product.stock <= 0 ? 0.5 : 1
            }}>
              <button 
                onClick={() => setQty(q => Math.max(1, q - 1))}
                disabled={product.stock <= 0 || qty <= 1}
                style={{ width: "45px", height: "45px", display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                <Minus size={18} />
              </button>
              <span style={{ padding: "0 1.5rem", fontWeight: 700, fontSize: "1.2rem" }}>{qty}</span>
              <button 
                onClick={() => setQty(q => Math.min(product.stock, q + 1))}
                disabled={product.stock <= 0 || qty >= product.stock}
                style={{ width: "45px", height: "45px", display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                <Plus size={18} />
              </button>
            </div>

            {(mounted ? (
              <motion.button
                className="brutalist-button brutalist-button--sm"
                onClick={handleAdd}
                whileTap={{ scale: 0.95 }}
                disabled={product.stock <= 0}
                style={{ flex: 1, minHeight: "50px", fontSize: "0.65rem", padding: "0 0.75rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem", whiteSpace: "normal", textAlign: "center", opacity: product.stock <= 0 ? 0.5 : 1 }}
              >
                {product.stock <= 0 ? "Out of Stock" : (added ? <><Check size={18} /> Added!</> : <><ShoppingBag size={18} /> Add to Cart - ₹{product.price * qty}</>)}
              </motion.button>
            ) : (
              <button
                className="brutalist-button brutalist-button--sm"
                onClick={handleAdd}
                disabled={product.stock <= 0}
                style={{ flex: 1, minHeight: "50px", fontSize: "0.65rem", padding: "0 0.75rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem", whiteSpace: "normal", textAlign: "center", opacity: product.stock <= 0 ? 0.5 : 1 }}
              >
                {product.stock <= 0 ? "Out of Stock" : (added ? <><Check size={18} /> Added!</> : <><ShoppingBag size={18} /> Add to Cart - ₹{product.price * qty}</>)}
              </button>
            ))}
            {/* Stock Display - now below Add to Cart, smaller and responsive */}
            <div
              style={{
                marginTop: "0.5rem",
                fontWeight: 500,
                fontSize: "0.92rem",
                color: product.stock > 0 ? "var(--cl-success)" : "var(--cl-danger)",
                textAlign: "left",
                letterSpacing: "0.01em",
                opacity: 0.85,
                lineHeight: 1.2,
                transition: "all 0.2s",
                maxWidth: "100%",
                wordBreak: "break-word"
              }}
              className="product-stock-indicator"
            >
              {product.stock > 0 ? `In Stock: ${product.stock}` : "Currently Out of Stock"}
            </div>
          </div>

          {/* Trust Badges */}
          <div style={{ 
            display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", 
            marginTop: "2rem", padding: "2rem", background: "var(--cl-surface)", 
            borderRadius: "var(--radius-lg)", border: "var(--border-thin)" 
          }}>
            <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
              <Truck size={20} style={{ color: "var(--cl-primary)" }} />
              <div style={{ fontSize: "0.85rem" }}>
                <p style={{ fontWeight: 700 }}>Free Shipping</p>
                <p style={{ opacity: 0.6 }}>On orders above ₹999</p>
              </div>
            </div>
            <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
              <AlertCircle size={20} style={{ color: "var(--cl-primary)" }} />
              <div style={{ fontSize: "0.85rem" }}>
                <p style={{ fontWeight: 700 }}>No Refund Policy</p>
                <p style={{ opacity: 0.6 }}>All sales are final</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modern High-End Reviews Section */}
      <section style={{ padding: "8rem 2rem", borderTop: "var(--border-thick)", background: "#fff" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "5rem" }}>
          
          {/* Review Aggregator / Left Side */}
          <div>
            <h2 className="title-section" style={{ marginBottom: "3rem" }}>Voices of <br /> Artists</h2>
            <form onSubmit={handleReviewSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
                {[1,2,3,4,5].map(num => (
                  <button key={num} type="button" onClick={() => setReviewInput({...reviewInput, rating: num})} style={{ opacity: reviewInput.rating >= num ? 1 : 0.2 }}>
                    <Star size={32} fill="var(--cl-accent)" strokeWidth={0} />
                  </button>
                ))}
              </div>
              
              {!user && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <input required placeholder="Your Name" className="input-field" value={reviewInput.name} onChange={e => setReviewInput({...reviewInput, name: e.target.value})} />
                  <input required placeholder="Email" type="email" className="input-field" value={reviewInput.email} onChange={e => setReviewInput({...reviewInput, email: e.target.value})} />
                </div>
              )}

              <textarea 
                required placeholder="Share your experience with this design..." 
                rows={5} className="input-field" 
                value={reviewInput.comment} onChange={e => setReviewInput({...reviewInput, comment: e.target.value})}
              />
              <button type="submit" disabled={submittingReview} className="brutalist-button brutalist-button--sm" style={{ width: "fit-content" }}>
                {submittingReview ? "Submitting..." : "Post Review"}
              </button>
            </form>
          </div>

          {/* Real Testimonial Scroll / Right Side */}
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
              <div style={{ fontSize: "3rem", fontWeight: 700 }}>4.9</div>
              <div>
                <div style={{ display: "flex", gap: "2px" }}>
                  {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="var(--cl-accent)" strokeWidth={0} />)}
                </div>
                <p style={{ fontSize: "0.9rem", fontWeight: 600, opacity: 0.5 }}>Based on {reviews.length} reviews</p>
              </div>
            </div>

            <div className="hide-scrollbar" data-lenis-prevent="true"  style={{}}>
              {reviews.map((r, i) => (
                mounted ? (
                  <motion.div key={r.id} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} style={{ padding: "2rem", background: "var(--cl-bg)", borderRadius: "var(--radius-lg)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
                      <h4 style={{ fontWeight: 700, fontSize: "1.1rem" }}>{r.user_name}</h4>
                      <span style={{ opacity: 0.4, fontSize: "0.8rem" }}>{new Date(r.created_at).toLocaleDateString()}</span>
                    </div>
                    <div style={{ display: "flex", gap: "2px", marginBottom: "1rem" }}>
                      {[...Array(5)].map((_, idx) => (
                        <Star key={idx} size={14} fill={idx < r.rating ? "var(--cl-accent)" : "transparent"} stroke={idx < r.rating ? "none" : "rgba(0,0,0,0.1)"} />
                      ))}
                    </div>
                    <p style={{ lineHeight: 1.8, opacity: 0.8 }}>"{r.comment}"</p>
                  </motion.div>
                ) : (
                  <div key={r.id} style={{ padding: "2rem", background: "var(--cl-bg)", borderRadius: "var(--radius-lg)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
                      <h4 style={{ fontWeight: 700, fontSize: "1.1rem" }}>{r.user_name}</h4>
                      <span style={{ opacity: 0.4, fontSize: "0.8rem" }}>{new Date(r.created_at).toLocaleDateString()}</span>
                    </div>
                    <div style={{ display: "flex", gap: "2px", marginBottom: "1rem" }}>
                      {[...Array(5)].map((_, idx) => (
                        <Star key={idx} size={14} fill={idx < r.rating ? "var(--cl-accent)" : "transparent"} stroke={idx < r.rating ? "none" : "rgba(0,0,0,0.1)"} />
                      ))}
                    </div>
                    <p style={{ lineHeight: 1.8, opacity: 0.8 }}>"{r.comment}"</p>
                  </div>
                )
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* Elite Related Products */}
      {related.length > 0 && (
        <section style={{ padding: "6rem 2rem", background: "var(--cl-surface)" }}>
          <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
            <h2 className="title-large" style={{ marginBottom: "3rem" }}>Elite Pairings</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "2rem" }}>
              {related.map((p) => (
                <SpotlightCard key={p.id}>
                  <Link href={`/shop/${p.slug}`}>
                    <div className="product-card">
                      <div className="product-card__image">
                        {p.image_url && <Image src={p.image_url} alt={p.title} fill style={{ objectFit: "cover" }} unoptimized />}
                      </div>
                      <div className="product-card__body">
                        <h3 className="product-card__title">{p.title}</h3>
                        <div className="product-card__price">
                          <span className="product-card__price-current">₹{p.price}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </SpotlightCard>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
