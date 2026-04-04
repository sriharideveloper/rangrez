"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { User, ShoppingBag, Menu, X, Sun, Moon, LogOut } from "lucide-react";
import { useCartStore } from "../store/cartStore";
import { createClient } from "../lib/supabase/client";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const { items, toggleCart, setUserId, clearCart } = useCartStore();
  const [user, setUser] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [theme, setTheme] = useState("light");

  const cartItems = Array.isArray(items) ? items : [];
  const itemCount = cartItems.reduce((t, i) => t + (i.quantity || 1), 0);

  useEffect(() => {
    const saved = localStorage.getItem("rangrez-theme") || "light";
    setTheme(saved);
    document.documentElement.setAttribute("data-theme", saved);

    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      const u = data?.user || null;
      setUser(u);
      if (u) setUserId(u.id);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      const current = session?.user || null;
      setUser(current);
      
      if (event === 'SIGNED_IN') {
        setUserId(current.id);
      } else if (event === 'SIGNED_OUT') {
        setUserId(null);
        clearCart();
      }
    });
    return () => subscription.unsubscribe();
  }, [setUserId, clearCart]);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("rangrez-theme", next);
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/shop" },
    { name: "Blog", href: "/blog" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <>
      <nav className="navbar-container border-b">
        <div className="navbar-brand">
          <div className="brand-logo-circle" />
          <Link href="/"><span className="brand-text">RANGREZ</span></Link>
        </div>

        <div className="navbar-links">
          {navLinks.map((l) => (
            <Link key={l.href} href={l.href} className="nav-link">{l.name}</Link>
          ))}
        </div>

        <div className="navbar-actions">
          <button onClick={toggleTheme} className="theme-toggle" aria-label="Toggle theme">
            {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
          </button>
          <Link href={user ? "/account" : "/login"}>
            <User size={24} color="var(--cl-text)" strokeWidth={2} />
          </Link>
          <button onClick={toggleCart} className="cart-btn" aria-label="Open cart">
            <ShoppingBag size={24} color="var(--cl-text)" strokeWidth={2} />
            {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
          </button>
          <button className="mobile-menu-btn" onClick={() => setMobileOpen(true)} aria-label="Open menu">
            <Menu size={24} color="var(--cl-text)" />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
              backgroundColor: "var(--cl-bg)", zIndex: 200, display: "flex",
              flexDirection: "column", padding: "2rem",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "3rem" }}>
              <span className="brand-text">RANGREZ</span>
              <button onClick={() => setMobileOpen(false)} aria-label="Close menu">
                <X size={28} />
              </button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {navLinks.map((l, i) => (
                <motion.div
                  key={l.href}
                  initial={{ x: -30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link
                    href={l.href}
                    onClick={() => setMobileOpen(false)}
                    style={{ fontSize: "2.5rem", fontFamily: "var(--font-heading)", textTransform: "uppercase" }}
                  >
                    {l.name}
                  </Link>
                </motion.div>
              ))}
            </div>
            <div style={{ marginTop: "auto", display: "flex", gap: "1rem" }}>
              <Link
                href={user ? "/account" : "/login"}
                onClick={() => setMobileOpen(false)}
                className="brutalist-button brutalist-button--full"
              >
                {user ? "My Account" : "Sign In"}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
