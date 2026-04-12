"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { WifiOff, ArrowRight } from "lucide-react";
import SplitText from "../../components/SplitText";

export default function OfflinePage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "var(--cl-bg)",
        color: "var(--cl-text)",
        position: "relative",
        overflow: "hidden",
        padding: "2rem",
        textAlign: "center",
      }}
    >
      <div
        className="arabic-decor"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          opacity: 0.03,
          fontSize: "30vw",
          whiteSpace: "nowrap",
          pointerEvents: "none",
        }}
      >
        غير متصل
      </div>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        style={{
          width: "120px",
          height: "120px",
          borderRadius: "50%",
          background: "var(--cl-surface)",
          border: "var(--border-thick)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "2rem",
          position: "relative",
          zIndex: 2,
        }}
      >
        <WifiOff size={48} strokeWidth={1.5} color="var(--cl-primary)" />
      </motion.div>

      <div style={{ position: "relative", zIndex: 2, maxWidth: "600px" }}>
        <h1
          className="title-massive"
          style={{
            fontSize: "clamp(2.5rem, 6vw, 4rem)",
            lineHeight: 1,
            marginBottom: "1.5rem",
          }}
        >
          <SplitText text="AIYO, NO WIFI." delay={0.1} />
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          style={{
            fontSize: "1.15rem",
            opacity: 0.7,
            lineHeight: 1.6,
            marginBottom: "3rem",
          }}
        >
          Your internet is taking longer to load than traditional salon mehndi takes to dry. And you know we hate waiting! Reconnect your WiFi so we can get back to our 5-minute magic.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          style={{ display: "flex", gap: "1rem", justifyContent: "center" }}
        >
          <button
            onClick={() => window.location.reload()}
            className="brutalist-button"
            style={{
              padding: "1rem 2.5rem",
              background: "var(--cl-primary)",
              color: "#fff",
              border: "none",
              fontSize: "1.1rem",
              cursor: "pointer",
            }}
          >
            Refresh & Slay
          </button>
        </motion.div>
      </div>
    </div>
  );
}