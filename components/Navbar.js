"use client";

import Link from "next/link";
import { User, ShoppingBag } from "lucide-react";
import { useCartStore } from "../store/cartStore";

export default function Navbar() {
  const { items, toggleCart } = useCartStore();
  const itemCount =
    items.reduce((total, item) => total + item.quantity, 0) || items.length;

  return (
    <nav
      className="navbar border-b"
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "1.5rem 2rem",
        backgroundColor: "var(--cl-bg)",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      {/* Left: Brand */}
      <div
        className="brand"
        style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
      >
        <div
          style={{
            width: "40px",
            height: "40px",
            backgroundColor: "var(--cl-text)",
            borderRadius: "50%",
          }}
        />
        <Link href="/">
          <span
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "2rem",
              lineHeight: "1",
              cursor: "pointer",
            }}
          >
            RANGREZ
          </span>
        </Link>
      </div>

      {/* Center: Links */}
      <div
        className="nav-links"
        style={{
          display: "flex",
          gap: "3rem",
          textTransform: "uppercase",
          fontWeight: "500",
          letterSpacing: "1px",
          fontSize: "0.9rem",
        }}
      >
        <Link href="/">Home</Link>
        <Link href="/shop">Shop</Link>
        <Link href="/about">About</Link>
        <Link href="/contact">Contact</Link>
      </div>

      {/* Right: Actions */}
      <div
        className="nav-actions"
        style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}
      >
        <Link href="/account">
          <User size={24} color="var(--cl-text)" />
        </Link>
        <button
          onClick={toggleCart}
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
          }}
        >
          <ShoppingBag size={24} color="var(--cl-text)" />
          {itemCount > 0 && (
            <span
              style={{
                position: "absolute",
                top: "-5px",
                right: "-8px",
                backgroundColor: "var(--cl-primary)",
                color: "var(--cl-bg)",
                borderRadius: "50%",
                width: "18px",
                height: "18px",
                fontSize: "0.7rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "700",
              }}
            >
              {itemCount}
            </span>
          )}
        </button>
      </div>
    </nav>
  );
}
