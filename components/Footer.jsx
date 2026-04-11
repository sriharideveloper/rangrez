"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Camera, Mail, ArrowUpRight } from "lucide-react";

export default function Footer() {
  const [year, setYear] = useState(2026);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);
  return (
    <footer className="footer">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "3rem", padding: "4rem 2rem 3rem" }}>
        {/* Brand */}
        <div>
          <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "2.5rem", marginBottom: "1rem", color: "var(--cl-bg)" }}>
            RANGREZ
          </h3>
          <p style={{ opacity: 0.6, lineHeight: 1.6, fontSize: "0.9rem", maxWidth: "280px" }}>
            Professional-grade reusable henna stencils. Arab luxury finesse meets Malabar artistry.
          </p>
        </div>

        {/* Shop */}
        <div>
          <h4 style={{ fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "1.5rem", fontFamily: "var(--font-body)", color: "var(--cl-bg)" }}>Shop</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <Link href="/shop">All Stencils</Link>
            <Link href="/shop?category=Bridal">Bridal Collection</Link>
            <Link href="/shop?category=Festival">Festival Collection</Link>
            <Link href="/shop?category=Everyday">Everyday Essentials</Link>
          </div>
        </div>

        {/* Help */}
        <div>
          <h4 style={{ fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "1.5rem", fontFamily: "var(--font-body)", color: "var(--cl-bg)" }}>Help & Legal</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <Link href="/contact">Contact Us</Link>
            <Link href="/about">Our Story</Link>
            <Link href="/terms">Terms & Conditions</Link>
            <Link href="/privacy">Privacy Policy</Link>
          </div>
        </div>

        {/* Connect */}
        <div>
          <h4 style={{ fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "1.5rem", fontFamily: "var(--font-body)", color: "var(--cl-bg)" }}>Connect</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <a href="https://www.instagram.com/rangrez_henna_stencils" target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Camera size={16} /> @rangrez_henna_stencils <ArrowUpRight size={12} />
            </a>
            <a href="mailto:rangrezstencils@gmail.com" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Mail size={16} /> rangrezstencils@gmail.com
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", padding: "1.5rem 2rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", fontSize: "0.8rem", opacity: 0.5 }}>
        <span>© {year} Rangrez Henna. All rights reserved.</span>
        <span>Made with ❤️ in Kochi. Malayali soul, global finesse.</span>
      </div>
    </footer>
  );
}
