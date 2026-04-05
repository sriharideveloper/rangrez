"use client";
import AnimatedCounter from "./AnimatedCounter";

export default function StatCard({ label, value, prefix = "", icon }) {
  return (
    <div className="admin-stat-card" style={{ padding: "1.5rem", border: "var(--border-thick)", background: "var(--cl-surface)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ width: "44px", height: "44px", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--cl-text)", color: "var(--cl-bg)", border: "var(--border-thick)" }}>
          {icon}
        </div>
      </div>
      <p style={{ fontSize: "2rem", fontWeight: 700, marginTop: "0.5rem" }}>
        <AnimatedCounter value={value} prefix={prefix} />
      </p>
      <p style={{ fontSize: "0.8rem", textTransform: "uppercase", fontWeight: 600, letterSpacing: "0.05em", opacity: 0.6 }}>{label}</p>
    </div>
  );
}