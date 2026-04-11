"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import ScrollFloat from "../../components/ScrollFloat";

export default function About() {
  return (
    <div style={{ minHeight: "100vh" }}>
      {/* Hero */}
      <section
        style={{
          background: "var(--cl-primary)",
          color: "var(--cl-bg)",
          padding: "6rem 2rem",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <motion.div
          animate={{ scale: [1, 1.2, 1], x: [0, 40, 0] }}
          transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
          style={{
            position: "absolute",
            top: "10%",
            right: "20%",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(212,168,83,0.2), transparent 70%)",
            filter: "blur(60px)",
          }}
        />
        <h1
          className="title-massive"
          style={{ position: "relative", zIndex: 2 }}
        >
          Our Story
        </h1>
      </section>

      {/* Genesis */}
      <section
        style={{ padding: "5rem 2rem", maxWidth: "900px", margin: "0 auto" }}
      >
        <ScrollFloat>
          <h2 className="title-section" style={{ marginBottom: "1.5rem" }}>
            Genesis of Artistry
          </h2>
          <p
            style={{
              fontSize: "1.2rem",
              lineHeight: 1.8,
              fontWeight: 300,
              marginBottom: "1rem",
            }}
          >
            Born from the intricate lanes of Malabar and deeply influenced by
            Arab luxury, Rangrez Henna was founded to bridge the gap between
            traditional heritage and modern convenience. The ritual of Mehndi
            has always been a profoundly slow, delicate process. We sought to
            reimagine its application for the contemporary world without
            sacrificing an ounce of its majestic detail.
          </p>
        </ScrollFloat>
        <ScrollFloat delay={0.2}>
          <h2
            className="title-section"
            style={{
              marginBottom: "1.5rem",
              textAlign: "right",
              marginTop: "4rem",
            }}
          >
            Modern Solution
          </h2>
          <p
            style={{
              fontSize: "1.2rem",
              lineHeight: 1.8,
              fontWeight: 300,
              textAlign: "right",
            }}
          >
            By utilizing high-grade, adhesives and precision-cut silicone
            materials, we have created stencils that honor the freehand mastery
            of generational artists. It is an unhinged dedication to extreme
            cleanliness and geometric purity, ensuring every stain left behind
            is perfectly balanced, crisp, and inherently premium.
          </p>
        </ScrollFloat>
      </section>

      {/* Image Break */}
      <section
        style={{
          height: "50vh",
          background: "var(--cl-secondary)",
          borderTop: "var(--border-thick)",
          borderBottom: "var(--border-thick)",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <Image
          src="https://images.unsplash.com/photo-1558000143-b6d85c8e2bd3?q=80&w=1000&auto=format&fit=crop"
          alt="Henna Mehndi Art"
          fill
          style={{ objectFit: "cover", opacity: 0.5, mixBlendMode: "multiply" }}
          unoptimized
        />
      </section>

      {/* Stats */}
      <section style={{ padding: "4rem 2rem" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "2rem",
            maxWidth: "900px",
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          {[
            { num: "50+", label: "Unique Designs" },
            { num: "1-Time", label: "Perfect Use" },
            { num: "10K+", label: "Happy Customers" },
            { num: "100%", label: "Skin Safe" },
          ].map((stat, i) => (
            <ScrollFloat key={i} delay={i * 0.1}>
              <div style={{ padding: "2rem", border: "var(--border-thick)" }}>
                <p
                  style={{
                    fontSize: "3rem",
                    fontFamily: "var(--font-heading)",
                    lineHeight: 1,
                  }}
                >
                  {stat.num}
                </p>
                <p
                  style={{
                    fontSize: "0.85rem",
                    textTransform: "uppercase",
                    fontWeight: 600,
                    letterSpacing: "0.08em",
                    marginTop: "0.5rem",
                    opacity: 0.6,
                  }}
                >
                  {stat.label}
                </p>
              </div>
            </ScrollFloat>
          ))}
        </div>
      </section>

      {/* Values */}
      <section
        style={{ padding: "4rem 2rem", maxWidth: "1000px", margin: "0 auto" }}
      >
        <ScrollFloat>
          <h2 className="title-section" style={{ marginBottom: "3rem" }}>
            Our Values
          </h2>
        </ScrollFloat>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "2rem",
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
              text: "Designed for perfection. Single-use and hygienic to ensure the cleanest, sharpest stain for your special occasion.",
            },
          ].map((val, i) => (
            <ScrollFloat key={i} delay={i * 0.15}>
              <div
                style={{
                  borderTop: "var(--border-thick)",
                  paddingTop: "1.5rem",
                }}
              >
                <h3 style={{ fontSize: "1.8rem", marginBottom: "0.75rem" }}>
                  {val.title}
                </h3>
                <p style={{ fontSize: "1rem", opacity: 0.7, lineHeight: 1.6 }}>
                  {val.text}
                </p>
              </div>
            </ScrollFloat>
          ))}
        </div>
      </section>
    </div>
  );
}
