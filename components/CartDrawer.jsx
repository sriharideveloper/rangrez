"use client";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useCartStore } from "../store/cartStore";

export default function CartDrawer() {
  const { isOpen, toggleCart, items, updateQuantity, removeItem, getSubtotal } = useCartStore();
  const cartItems = Array.isArray(items) ? items : [];
  const subtotal = getSubtotal();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleCart}
            style={{
              position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
              backgroundColor: "var(--cl-overlay)", backdropFilter: "blur(4px)", zIndex: 90,
            }}
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            style={{
              position: "fixed", top: 0, right: 0, width: "100%", maxWidth: "440px",
              height: "100vh", backgroundColor: "var(--cl-bg)", zIndex: 100,
              display: "flex", flexDirection: "column", borderLeft: "var(--border-thick)",
            }}
          >
            {/* Header */}
            <div className="border-b" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1.25rem 1.5rem" }}>
              <h2 style={{ fontSize: "1.5rem", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <ShoppingBag size={22} /> Cart
                {cartItems.length > 0 && (
                  <span style={{ fontSize: "0.8rem", background: "var(--cl-primary)", color: "var(--cl-bg)", padding: "0.1rem 0.5rem", fontWeight: 700, fontFamily: "var(--font-body)" }}>
                    {cartItems.length}
                  </span>
                )}
              </h2>
              <button
                onClick={toggleCart}
                style={{ width: "2.2rem", height: "2.2rem", border: "var(--border-thick)", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--cl-bg)", cursor: "pointer" }}
              >
                <X size={18} strokeWidth={3} />
              </button>
            </div>

            {/* Items */}
            <div className="hide-scrollbar" data-lenis-prevent="true"  style={{}}>
              {cartItems.length === 0 ? (
                <div style={{ textAlign: "center", marginTop: "4rem" }}>
                  <ShoppingBag size={48} strokeWidth={1} style={{ opacity: 0.2, marginBottom: "1rem" }} />
                  <h3 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>Cart is empty</h3>
                  <p style={{ opacity: 0.5, fontSize: "0.9rem" }}>Your masterpiece awaits its tools.</p>
                  <button onClick={toggleCart} className="brutalist-button" style={{ marginTop: "1.5rem" }}>
                    Shop Now
                  </button>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {cartItems.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      style={{ display: "flex", gap: "1rem", padding: "1rem", border: "var(--border-thick)", background: "var(--cl-surface)" }}
                    >
                      <div style={{ width: "72px", height: "72px", background: "var(--cl-secondary)", border: "2px solid var(--cl-text)", overflow: "hidden", flexShrink: 0 }}>
                        {(item.image || item.image_url || item.images?.[0]) && (
                          <Image 
                            src={item.image || item.image_url || item.images?.[0]} 
                            alt={item.title || "Cart item"} 
                            width={72} 
                            height={72} 
                            style={{ objectFit: "cover", width: "100%", height: "100%" }} 
                            unoptimized 
                          />
                        )}
                      </div>
                      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <div>
                            <h4 style={{ fontSize: "0.95rem", fontWeight: 600, fontFamily: "var(--font-body)" }}>{item.title || "Stencil"}</h4>
                          </div>
                          <span style={{ fontWeight: 700, fontSize: "0.95rem", whiteSpace: "nowrap", marginLeft: "1rem" }}>₹{item.price * item.quantity}</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.5rem" }}>
                          <div style={{ display: "inline-flex", alignItems: "center", border: "2px solid var(--cl-text)" }}>
                            <button onClick={() => updateQuantity(item.id, item.quantity - 1)} style={{ padding: "0.2rem 0.4rem", borderRight: "2px solid var(--cl-text)" }}>
                              <Minus size={14} strokeWidth={3} />
                            </button>
                            <span style={{ padding: "0 0.75rem", fontWeight: 700, fontSize: "0.85rem" }}>{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)} style={{ padding: "0.2rem 0.4rem", borderLeft: "2px solid var(--cl-text)" }}>
                              <Plus size={14} strokeWidth={3} />
                            </button>
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            style={{ color: "var(--cl-primary)", display: "flex", alignItems: "center", gap: "0.25rem", fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase" }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="border-t" style={{ padding: "1.25rem 1.5rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                  <span style={{ fontSize: "1rem", fontWeight: 600, textTransform: "uppercase" }}>Subtotal</span>
                  <span style={{ fontSize: "1.3rem", fontWeight: 700 }}>₹{subtotal.toFixed(0)}</span>
                </div>
                {subtotal < 999 && (
                  <p style={{ fontSize: "0.8rem", opacity: 0.6, marginBottom: "1rem", textAlign: "center" }}>
                    Add ₹{(999 - subtotal).toFixed(0)} more for free shipping!
                  </p>
                )}
                <Link
                  href="/checkout"
                  onClick={toggleCart}
                  className="brutalist-button brutalist-button--sm brutalist-button--full"
                  style={{ padding: "1rem" }}
                >
                  Checkout <ArrowRight size={16} />
                </Link>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
