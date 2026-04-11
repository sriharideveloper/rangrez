"use client";
import Image from "next/image";
import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useCartStore } from "../../store/cartStore";
import { getAllProducts } from "../../lib/supabase/products";
import SpotlightCard from "../../components/SpotlightCard";
import ScrollFloat from "../../components/ScrollFloat";
import { SlidersHorizontal, X } from "lucide-react";

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("featured");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    async function loadProducts() {
      const data = await getAllProducts();
      setProducts(data);
      setLoading(false);
    }
    loadProducts();
  }, []);

  const sizes = useMemo(() => {
    return [
      "all",
      "Bridal",
      "Semi Bridal",
      "Extra Large",
      "Large",
      "Medium",
      "Small",
    ];
  }, []);

  const filteredProducts = useMemo(() => {
    let result =
      filter === "all" ? products : products.filter((p) => p.size === filter);

    if (searchQuery) {
      const lowerQ = searchQuery.toLowerCase();
      result = result.filter((p) => {
        const titleMatch = p.title?.toLowerCase().includes(lowerQ);
        const nameMatch = p.name?.toLowerCase().includes(lowerQ);
        return titleMatch || nameMatch;
      });
    }

    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "new":
        result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        break;
      default:
        result.sort(
          (a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0),
        );
        break;
    }
    return result;
  }, [filter, sortBy, products, searchQuery]);

  return (
    <div
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <div
        className="border-b"
        style={{
          padding: "3rem 2rem",
          textAlign: "center",
          background: "var(--cl-surface)",
        }}
      >
        <h1 className="title-large" style={{ marginBottom: "1rem" }}>
          The Collection
        </h1>
        <p
          style={{
            maxWidth: "600px",
            margin: "0 auto",
            opacity: 0.8,
            fontSize: "1.1rem",
          }}
        >
          Premium henna stencils designed for modern aesthetics and effortless
          application.
        </p>
      </div>

      <div style={{ display: "flex", flex: 1, position: "relative" }}>
        {/* Desktop Sidebar */}
        <aside
          style={{
            width: "260px",
            padding: "2rem",
            borderRight: "var(--border-thick)",
            display: "none",
          }}
          className="md:block"
        >
          <h3
            style={{
              fontSize: "1rem",
              fontWeight: 700,
              textTransform: "uppercase",
              marginBottom: "1.5rem",
            }}
          >
            Filter by Size
          </h3>
          <ul
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
              listStyle: "none",
              padding: 0,
            }}
          >
            {sizes.map((cat) => (
              <li key={cat}>
                <button
                  onClick={() => setFilter(cat)}
                  style={{
                    background: "none",
                    border: "none",
                    textTransform: "uppercase",
                    fontSize: "0.85rem",
                    fontWeight: filter === cat ? 700 : 400,
                    opacity: filter === cat ? 1 : 0.6,
                    cursor: "pointer",
                    transition: "var(--transition-base)",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <span
                    style={{
                      width: "12px",
                      height: "12px",
                      border: "1.5px solid var(--cl-text)",
                      background:
                        filter === cat ? "var(--cl-text)" : "transparent",
                    }}
                  />
                  {cat}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* Mobile Filter Overlay */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              key="mobile-filters"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              data-lenis-prevent="true"
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: "var(--cl-bg)",
                zIndex: 9999,
                overflowY: "auto",
                padding: "2rem",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "3rem",
                }}
              >
                <h3
                  style={{
                    fontSize: "2rem",
                    textTransform: "uppercase",
                    fontFamily: "var(--font-heading)",
                  }}
                >
                  Filters
                </h3>
                <button
                  onClick={() => setShowFilters(false)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  <X size={32} />
                </button>
              </div>

              <h4
                style={{
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  opacity: 0.5,
                  marginBottom: "1rem",
                }}
              >
                Size
              </h4>
              <ul
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                  listStyle: "none",
                  padding: 0,
                }}
              >
                {sizes.map((cat) => (
                  <li key={cat}>
                    <button
                      onClick={() => {
                        setFilter(cat);
                        setShowFilters(false);
                      }}
                      className="brutalist-button brutalist-button--outline"
                      style={{
                        width: "100%",
                        textAlign: "center",
                        textTransform: "uppercase",
                        background:
                          filter === cat ? "var(--cl-text)" : "transparent",
                        color:
                          filter === cat ? "var(--cl-bg)" : "var(--cl-text)",
                      }}
                    >
                      {cat}
                    </button>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => {
                  setFilter("all");
                  setShowFilters(false);
                }}
                style={{
                  marginTop: "auto",
                  padding: "1.5rem",
                  background: "none",
                  border: "none",
                  fontFamily: "var(--font-body)",
                  fontWeight: 700,
                  color: "var(--cl-text)",
                  textDecoration: "underline",
                  textTransform: "uppercase",
                  cursor: "pointer",
                }}
              >
                Clear All Filters
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <div
          style={{
            flex: 1,
            padding: "2rem",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Toolbar */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "2rem",
              gap: "1rem",
            }}
          >
            <button
              className="brutalist-button brutalist-button--outline md:hidden"
              onClick={() => setShowFilters(true)}
              style={{ width: "100%", justifyContent: "center" }}
            >
              <SlidersHorizontal size={18} /> Filters & Sort
            </button>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "1rem",
                flex: 1,
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  padding: "0.8rem 1rem",
                  border: "var(--border-thick)",
                  background: "transparent",
                  color: "var(--cl-text)",
                  outline: "none",
                  width: "100%",
                  maxWidth: "300px",
                  fontSize: "0.9rem",
                  textTransform: "uppercase",
                  fontWeight: 600,
                }}
              />
              <span
                style={{
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  textTransform: "uppercase",
                }}
              >
                {filteredProducts.length} Products
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  padding: "0.8rem 1rem",
                  border: "var(--border-thick)",
                  background: "var(--cl-bg)",
                  color: "var(--cl-text)",
                  fontFamily: "var(--font-body)",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  cursor: "pointer",
                  outline: "none",
                  maxWidth: "200px",
                }}
              >
                <option value="featured">Featured First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="new">Newest Arrivals</option>
              </select>
            </div>
          </div>

          {/* Grid */}
          {loading ? (
            <div style={{ padding: "4rem", textAlign: "center" }}>
              Loading catalog...
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: "1.5rem",
              }}
            >
              {filteredProducts.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  layout
                >
                  <SpotlightCard>
                    <Link
                      href={`/shop/${p.slug}`}
                      style={{ display: "block", textDecoration: "none" }}
                    >
                      <div className="product-card">
                        <div className="product-card__image">
                          {p.image_url && (
                            <Image
                              src={p.image_url}
                              alt={p.title || "Product Image"}
                              fill
                              style={{ objectFit: "cover" }}
                              sizes="(max-width: 768px) 100vw, 33vw"
                              unoptimized
                              priority={i < 6}
                            />
                          )}
                          {p.stock <= 0 && (
                            <span
                              style={{
                                position: "absolute",
                                top: "1rem",
                                right: "1rem",
                                background: "var(--cl-primary)",
                                color: "var(--cl-bg)",
                                padding: "0.3rem 0.8rem",
                                fontSize: "0.7rem",
                                fontWeight: 700,
                                textTransform: "uppercase",
                                zIndex: 2,
                              }}
                            >
                              Out of Stock
                            </span>
                          )}
                        </div>
                        <div className="product-card__body">
                          <div>
                            <span
                              style={{
                                fontSize: "0.7rem",
                                fontWeight: 700,
                                textTransform: "uppercase",
                                opacity: 0.6,
                                letterSpacing: "0.05em",
                                display: "block",
                              }}
                            >
                              {p.size}
                            </span>
                            <h3 className="product-card__title">{p.title}</h3>
                          </div>
                          <div className="product-card__price">
                            {p.compare_at_price && (
                              <span className="product-card__price-compare">
                                ₹{p.compare_at_price}
                              </span>
                            )}
                            <span className="product-card__price-current">
                              ₹{p.price}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </SpotlightCard>
                </motion.div>
              ))}
              {filteredProducts.length === 0 && (
                <div
                  style={{
                    gridColumn: "1/-1",
                    textAlign: "center",
                    padding: "4rem 0",
                    borderTop: "var(--border-thin)",
                    marginTop: "2rem",
                  }}
                >
                  <h3 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>
                    No products found
                  </h3>
                  <p style={{ opacity: 0.6 }}>Try adjusting your filters.</p>
                  <button
                    onClick={() => {
                      setFilter("all");
                      setSortBy("featured");
                      setSearchQuery("");
                    }}
                    className="brutalist-button"
                    style={{ marginTop: "1.5rem" }}
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @media (min-width: 768px) { .md\\:block { display: block !important; } .md\\:hidden { display: none !important; } }
      `,
        }}
      />
    </div>
  );
}
