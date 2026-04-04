"use client";

import { motion } from "framer-motion";
import { useCartStore } from "../../store/cartStore";

const products = [
  {
    id: 1,
    title: "Bridal Full Hand Set",
    price: 1499,
    style: "Bridal",
    status: "Best Seller",
    image:
      "https://images.unsplash.com/photo-1542171120-745a907fe23f?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: 2,
    title: "Geometric Minimalist Strip",
    price: 349,
    style: "Geometric",
    status: "New",
    image:
      "https://images.unsplash.com/photo-1498877546374-32b03fb164ab?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: 3,
    title: "Classic Arabic Floral",
    price: 499,
    style: "Arabic",
    status: "In Stock",
    image:
      "https://images.unsplash.com/photo-1628581691234-807d9f7831f2?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: 4,
    title: "Paisley Precision",
    price: 549,
    style: "Paisley",
    status: "Low Stock",
    image:
      "https://images.unsplash.com/photo-1542171120-745a907fe23f?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: 5,
    title: "Festival Mandala",
    price: 899,
    style: "Festival",
    status: "In Stock",
    image:
      "https://images.unsplash.com/photo-1628581691234-807d9f7831f2?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: 6,
    title: "Minimalist Lines",
    price: 299,
    style: "Geometric",
    status: "New",
    image:
      "https://images.unsplash.com/photo-1498877546374-32b03fb164ab?auto=format&fit=crop&q=80&w=600",
  },
];

export default function Shop() {
  const { addItem } = useCartStore();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        backgroundColor: "var(--cl-bg)",
        minHeight: "100vh",
      }}
    >
      {/* Header */}
      <div
        className="border-b"
        style={{
          padding: "4rem 2rem",
          textAlign: "center",
          backgroundColor: "var(--cl-secondary)",
        }}
      >
        <h1 className="title-massive" style={{ textTransform: "uppercase" }}>
          Shop Stencils
        </h1>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", width: "100%" }}>
        {/* Left Column (Filters) - Desktop: 300px, Mobile: 100% */}
        <aside
          className="border-r"
          style={{
            width: "300px",
            flexShrink: 0,
            padding: "2rem",
            backgroundColor: "var(--cl-bg)",
          }}
        >
          <h2
            style={{
              fontSize: "1.2rem",
              fontWeight: "600",
              marginBottom: "2rem",
              textTransform: "uppercase",
            }}
          >
            Filters
          </h2>

          <div style={{ marginBottom: "2rem" }}>
            <h3
              style={{
                fontSize: "1rem",
                fontWeight: "600",
                marginBottom: "1rem",
              }}
            >
              Design Style
            </h3>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              {[
                "Floral",
                "Geometric",
                "Paisley",
                "Arabic",
                "Bridal",
                "Festival",
              ].map((style, i) => (
                <label
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    style={{
                      accentColor: "var(--cl-primary)",
                      width: "1.2rem",
                      height: "1.2rem",
                      border: "var(--border-thick)",
                    }}
                  />
                  <span style={{ fontSize: "1rem", fontWeight: "400" }}>
                    {style}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h3
              style={{
                fontSize: "1rem",
                fontWeight: "600",
                marginBottom: "1rem",
              }}
            >
              Price Range
            </h3>
            <input
              type="range"
              min="0"
              max="2000"
              defaultValue="1000"
              style={{ width: "100%", accentColor: "var(--cl-primary)" }}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "0.5rem",
                fontSize: "0.9rem",
              }}
            >
              <span>₹0</span>
              <span>₹2000+</span>
            </div>
          </div>
        </aside>

        {/* Right Column (Grid) */}
        <main style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          {/* Utility Bar */}
          <div
            className="border-b"
            style={{
              padding: "1rem 2rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: "var(--cl-bg)",
            }}
          >
            <span style={{ fontSize: "0.9rem", fontWeight: "500" }}>
              Showing {products.length} products
            </span>
            <select
              style={{
                padding: "0.5rem 1rem",
                border: "var(--border-thick)",
                backgroundColor: "transparent",
                cursor: "pointer",
              }}
            >
              <option>Sort by: Featured</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Newest Arrivals</option>
            </select>
          </div>

          {/* Product Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            }}
          >
            {products.map((product, idx) => (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                key={product.id}
                className="border-b border-r"
                style={{ display: "flex", flexDirection: "column" }}
              >
                <div
                  style={{
                    position: "relative",
                    height: "350px",
                    overflow: "hidden",
                    borderBottom: "var(--border-thick)",
                    backgroundColor: "var(--cl-secondary)",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: "1rem",
                      left: "1rem",
                      backgroundColor: "var(--cl-bg)",
                      padding: "0.25rem 0.75rem",
                      fontSize: "0.8rem",
                      fontWeight: "600",
                      textTransform: "uppercase",
                      border: "2px solid var(--cl-text)",
                      zIndex: 10,
                    }}
                  >
                    {product.status}
                  </div>
                  {/* Image Placeholder */}
                  <motion.img
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.4 }}
                    src={product.image}
                    alt={product.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>
                <div
                  style={{
                    padding: "1.5rem",
                    display: "flex",
                    flexDirection: "column",
                    flex: 1,
                    backgroundColor: "var(--cl-bg)",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "1.2rem",
                      fontFamily: "var(--font-body)",
                      fontWeight: "600",
                      marginBottom: "0.25rem",
                    }}
                  >
                    {product.title}
                  </h3>
                  <p
                    style={{
                      opacity: 0.6,
                      fontSize: "0.9rem",
                      marginBottom: "1rem",
                    }}
                  >
                    {product.style}
                  </p>
                  <p
                    style={{
                      fontSize: "1.2rem",
                      fontWeight: "400",
                      marginBottom: "2rem",
                    }}
                  >
                    ₹{product.price}
                  </p>

                  <div style={{ marginTop: "auto" }}>
                    <button
                      onClick={() =>
                        addItem({ ...product, quantity: 1, size: "Standard" })
                      }
                      className="btn-primary"
                      style={{
                        width: "100%",
                        padding: "1rem",
                        fontSize: "0.9rem",
                      }}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
