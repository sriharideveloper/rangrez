"use client";

import { motion } from "framer-motion";

export default function About() {
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
      {/* Hero Section */}
      <section
        style={{
          backgroundColor: "var(--cl-primary)",
          color: "var(--cl-bg)",
          padding: "8rem 2rem",
          textAlign: "center",
          borderBottom: "var(--border-thick)",
        }}
      >
        <motion.h1
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="title-massive"
          style={{ textTransform: "uppercase" }}
        >
          Our Story
        </motion.h1>
      </section>

      {/* Main Content */}
      <section
        className="container"
        style={{ padding: "6rem var(--space-lg)", maxWidth: "1000px" }}
      >
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ marginBottom: "5rem" }}
        >
          <h2
            style={{
              fontSize: "3rem",
              marginBottom: "2rem",
              textTransform: "uppercase",
            }}
          >
            Genesis of Artistry
          </h2>
          <p
            style={{
              fontSize: "1.4rem",
              lineHeight: "1.8",
              fontWeight: "300",
              marginBottom: "1.5rem",
            }}
          >
            Born from the intricate lanes of Malabar and deeply influenced by
            Arab luxury, Rangrez Henna was founded to bridge the gap between
            traditional heritage and modern convenience. The ritual of Mehndi
            has always been a profoundly slow, delicate process. We sought to
            reimagine its application for the contemporary paced world without
            sacrificing an ounce of its majestic detail.
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 40, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2
            style={{
              fontSize: "3rem",
              marginBottom: "2rem",
              textTransform: "uppercase",
              textAlign: "right",
            }}
          >
            Modern Solution
          </h2>
          <p
            style={{
              fontSize: "1.4rem",
              lineHeight: "1.8",
              fontWeight: "300",
              textAlign: "right",
              marginLeft: "auto",
              maxWidth: "800px",
            }}
          >
            By utilizing high-grade, reusable adhesives and precision-cut
            silicone materials, we have created stencils that honor the freehand
            mastery of generational artists. It is an unhinged dedication to
            extreme cleanliness and geometric purity, ensuring every stain left
            behind is perfectly balanced, crisp, and inherently premium.
          </p>
        </motion.div>
      </section>

      {/* Brand Image / Visual Breaker */}
      <section
        style={{
          height: "60vh",
          width: "100%",
          backgroundColor: "var(--cl-secondary)",
          borderTop: "var(--border-thick)",
          borderBottom: "var(--border-thick)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <img
          src="https://images.unsplash.com/photo-1555169062-013468b47731?auto=format&fit=crop&q=80&w=1600"
          alt="Henna Process"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
            mixBlendMode: "overlay",
            opacity: 0.6,
          }}
        />
      </section>

      {/* Values */}
      <section
        className="container"
        style={{
          padding: "6rem var(--space-lg)",
          display: "flex",
          flexWrap: "wrap",
          gap: "4rem",
          justifyContent: "space-between",
        }}
      >
        {[
          {
            title: "Precision",
            text: "Every stencil is cut with absolute mathematical accuracy to ensure the final stain is flawless.",
          },
          {
            title: "Heritage",
            text: "Roots in centuries-old traditions, adapted for effortless modern aesthetics.",
          },
          {
            title: "Sustainability",
            text: "Built to last. Washable and reusable for up to five full sessions without losing tackiness.",
          },
        ].map((val, idx) => (
          <div
            key={idx}
            style={{
              flex: "1 1 300px",
              borderTop: "var(--border-thick)",
              paddingTop: "2rem",
            }}
          >
            <h3
              style={{
                fontSize: "2rem",
                marginBottom: "1rem",
                textTransform: "uppercase",
              }}
            >
              {val.title}
            </h3>
            <p style={{ fontSize: "1.1rem", opacity: 0.8, lineHeight: "1.6" }}>
              {val.text}
            </p>
          </div>
        ))}
      </section>
    </div>
  );
}
