"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useCartStore } from "../store/cartStore";

// Mock Data
const trendingProducts = [
  {
    id: 1,
    title: "Bridal Full Hand Set",
    price: 1499,
    status: "Best Seller",
    image:
      "https://images.unsplash.com/photo-1542171120-745a907fe23f?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: 2,
    title: "Geometric Minimalist Strip",
    price: 349,
    status: "New",
    image:
      "https://images.unsplash.com/photo-1498877546374-32b03fb164ab?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: 3,
    title: "Classic Arabic Floral",
    price: 499,
    status: "In Stock",
    image:
      "https://images.unsplash.com/photo-1628581691234-807d9f7831f2?auto=format&fit=crop&q=80&w=600",
  },
];

export default function Home() {
  const { addItem } = useCartStore();

  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
      {/* 1. Hero Section */}
      <section
        style={{
          position: "relative",
          minHeight: "90vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          borderBottom: "var(--border-thick)",
          backgroundColor: "var(--cl-primary)",
        }}
      >
        {/* Background Placeholder Image */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundImage:
              "url('https://images.unsplash.com/photo-1542171120-745a907fe23f?auto=format&fit=crop&q=80&w=2000')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.15,
            mixBlendMode: "multiply",
          }}
        ></div>

        {/* Hero Content */}
        <div
          className="container"
          style={{ position: "relative", zIndex: 10, textAlign: "center" }}
        >
          <motion.h1
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="title-massive"
            style={{
              color: "var(--cl-bg)",
              textTransform: "uppercase",
              marginBottom: "1rem",
            }}
          >
            Rangrez Henna
          </motion.h1>
          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            style={{
              fontSize: "clamp(1.2rem, 3vw, 1.8rem)",
              color: "var(--cl-bg)",
              marginBottom: "3rem",
              fontWeight: "300",
            }}
          >
            Professional-grade reusable stencils for precision artistry.
          </motion.p>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            style={{
              display: "flex",
              gap: "1rem",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Link href="/shop">
              <button
                className="btn-primary"
                style={{
                  backgroundColor: "var(--cl-bg)",
                  color: "var(--cl-primary)",
                  border: "3px solid var(--cl-bg)",
                }}
              >
                Shop Now
              </button>
            </Link>
            <Link href="/shop">
              <button
                className="btn-primary"
                style={{
                  backgroundColor: "transparent",
                  color: "var(--cl-bg)",
                  border: "3px solid var(--cl-bg)",
                }}
              >
                Explore Collections
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 2. Marquee Banner */}
      <div
        className="border-b"
        style={{
          overflow: "hidden",
          whiteSpace: "nowrap",
          padding: "1.5rem 0",
          backgroundColor: "var(--cl-bg)",
        }}
      >
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
          style={{
            display: "inline-block",
            fontSize: "2.5rem",
            fontFamily: "var(--font-heading)",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
          }}
        >
          ARTISTRY — RANGREZ — PROFESSIONAL — ARTISTRY — RANGREZ — PROFESSIONAL
          — ARTISTRY — RANGREZ — PROFESSIONAL — ARTISTRY — RANGREZ —
          PROFESSIONAL —
        </motion.div>
      </div>

      {/* 3. Trending Now */}
      <section
        className="container"
        style={{ padding: "6rem var(--space-lg)" }}
      >
        <h2
          style={{
            fontSize: "4rem",
            textTransform: "uppercase",
            marginBottom: "3rem",
            textAlign: "center",
          }}
        >
          Trending Now
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "2rem",
          }}
        >
          {trendingProducts.map((product, idx) => (
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              key={product.id}
              className="product-card border-b border-l border-r border-t"
              style={{ display: "flex", flexDirection: "column" }}
            >
              <div
                style={{
                  position: "relative",
                  height: "400px",
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
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
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
                    fontSize: "1.5rem",
                    fontFamily: "var(--font-body)",
                    fontWeight: "600",
                    marginBottom: "0.5rem",
                  }}
                >
                  {product.title}
                </h3>
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
                    onClick={() => addItem({ ...product, quantity: 1 })}
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
      </section>

      {/* 4. Shop by Collection */}
      <section
        className="border-t border-b"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        }}
      >
        {[
          { title: "Premium Trial", bg: "var(--cl-secondary)" },
          {
            title: "New Arrivals",
            bg: "var(--cl-primary)",
            color: "var(--cl-bg)",
          },
          {
            title: "Best Sellers",
            bg: "var(--cl-text)",
            color: "var(--cl-bg)",
          },
        ].map((collection, idx) => (
          <div
            key={idx}
            className="border-r"
            style={{
              backgroundColor: collection.bg,
              color: collection.color || "var(--cl-text)",
              padding: "8rem 2rem",
              textAlign: "center",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "opacity 0.3s",
            }}
          >
            <h2
              className="title-massive"
              style={{
                fontSize: "clamp(2rem, 5vw, 4rem)",
                transition: "transform 0.3s",
              }}
            >
              {collection.title}
            </h2>
          </div>
        ))}
      </section>

      {/* 5. The Rangrez Story */}
      <section
        className="container"
        style={{ padding: "8rem var(--space-lg)", textAlign: "center" }}
      >
        <h2
          style={{
            fontSize: "4rem",
            textTransform: "uppercase",
            marginBottom: "2rem",
          }}
        >
          The Rangrez Story
        </h2>
        <p
          style={{
            maxWidth: "800px",
            margin: "0 auto 4rem",
            fontSize: "1.2rem",
            lineHeight: "1.8",
            fontWeight: "300",
          }}
        >
          Rooted in the rich cultural history of Malabar and crafted for modern
          brutalist aesthetics. Rangrez provides unhinged beauty with absolute
          precision, reimagining traditional Mehndi art through our reusable,
          professional-grade stencils.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "3rem",
            marginTop: "4rem",
          }}
        >
          {[
            {
              title: "Skin Safe",
              desc: "Dermatologically tested medical-grade adhesive that prevents irritation.",
            },
            {
              title: "Reusable",
              desc: "Washable layers designed to last up to 5 individual sessions.",
            },
            {
              title: "Authentic Designs",
              desc: "Patterns drafted by expert artisans to mimic real freehand artistry.",
            },
          ].map((feature, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "1rem",
              }}
            >
              <div
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  border: "var(--border-thick)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "2rem",
                  backgroundColor: "var(--cl-secondary)",
                }}
              >
                {i + 1}
              </div>
              <h3 style={{ fontSize: "1.5rem", fontWeight: "600" }}>
                {feature.title}
              </h3>
              <p style={{ opacity: 0.8, fontSize: "1rem" }}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Global Footer simple placeholder for now */}
      <footer
        className="border-t"
        style={{
          backgroundColor: "var(--cl-text)",
          color: "var(--cl-bg)",
          padding: "4rem 2rem",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "3rem",
            marginBottom: "1rem",
          }}
        >
          RANGREZ
        </h2>
        <p style={{ opacity: 0.7, marginBottom: "2rem" }}>
          Intricate designs. Effortless art.
        </p>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "2rem",
            fontSize: "0.9rem",
            textTransform: "uppercase",
            letterSpacing: "1px",
          }}
        >
          <Link href="/shop">Shop</Link>
          <Link href="/about">About Us</Link>
          <Link href="/contact">Contact</Link>
        </div>
      </footer>
    </div>
  );
}
