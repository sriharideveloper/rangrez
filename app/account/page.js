"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { createClient } from "../../lib/supabase/client";
import { signOut } from "../actions/auth";
import { LogOut, Package, User, Settings } from "lucide-react";

export default function Account() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("Details");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data }) => {
      if (data?.user) {
        setUser(data.user);
        const { data: p } = await supabase.from("profiles").select("*").eq("id", data.user.id).single();
        setProfile(p);
        const { data: o } = await supabase.from("orders").select("*").eq("user_id", data.user.id).order("created_at", { ascending: false });
        setOrders(o || []);
      }
      setLoading(false);
    });
  }, []);

  const tabs = [
    { id: "Details", icon: <User size={18} /> },
    { id: "Orders", icon: <Package size={18} /> },
    { id: "Settings", icon: <Settings size={18} /> },
  ];

  // Mock orders for display
  const displayOrders = orders.length > 0 ? orders : [
    { id: "RGZ-20491", created_at: "2026-04-02", total: 1499, status: "delivered" },
    { id: "RGZ-20388", created_at: "2026-03-15", total: 2450, status: "shipped" },
    { id: "RGZ-19842", created_at: "2026-01-10", total: 499, status: "processing" },
  ];

  if (loading) {
    return (
      <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} style={{ width: 40, height: 40, border: "var(--border-thick)", borderTopColor: "var(--cl-primary)", borderRadius: "50%" }} />
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh" }}>
      {/* Header */}
      <div className="border-b" style={{ padding: "3rem 2rem", textAlign: "center", background: "var(--cl-secondary)" }}>
        <h1 className="title-massive">Account</h1>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", maxWidth: "1200px", margin: "0 auto" }}>
        {/* Sidebar */}
        <aside style={{ flex: "0 0 240px", padding: "2rem 1.5rem 2rem 0", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                textAlign: "left", padding: "0.9rem 1rem", fontSize: "1rem",
                textTransform: "uppercase", fontWeight: activeTab === tab.id ? 700 : 400,
                background: activeTab === tab.id ? "var(--cl-primary)" : "transparent",
                color: activeTab === tab.id ? "var(--cl-bg)" : "var(--cl-text)",
                border: activeTab === tab.id ? "var(--border-thick)" : "none",
                transition: "var(--transition-snap)",
                display: "flex", alignItems: "center", gap: "0.75rem",
              }}
            >
              {tab.icon} {tab.id}
            </button>
          ))}
          <form action={signOut} style={{ marginTop: "auto" }}>
            <button
              type="submit"
              style={{ textAlign: "left", padding: "0.9rem 1rem", fontSize: "1rem", textTransform: "uppercase", opacity: 0.6, display: "flex", alignItems: "center", gap: "0.75rem", marginTop: "2rem" }}
            >
              <LogOut size={18} /> Log Out
            </button>
          </form>
        </aside>

        {/* Content */}
        <main className="border-l" style={{ flex: 1, padding: "2rem 2.5rem", minWidth: "300px" }}>
          <motion.div key={activeTab} initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
            <h2 className="title-section" style={{ marginBottom: "2rem" }}>{activeTab}</h2>

            {activeTab === "Details" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "2rem", maxWidth: "500px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                  <div>
                    <p className="text-label">Name</p>
                    <p style={{ fontSize: "1.1rem", fontWeight: 500, marginTop: "0.25rem" }}>
                      {profile?.full_name || user?.user_metadata?.full_name || user?.user_metadata?.name || "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-label">Role</p>
                    <p style={{ fontSize: "1.1rem", fontWeight: 500, marginTop: "0.25rem", textTransform: "capitalize" }}>
                      {profile?.role || "Customer"}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-label">Email</p>
                  <p style={{ fontSize: "1.1rem", fontWeight: 500, marginTop: "0.25rem" }}>{user?.email}</p>
                </div>
                <div>
                  <p className="text-label">Member Since</p>
                  <p style={{ fontSize: "1.1rem", fontWeight: 500, marginTop: "0.25rem" }}>
                    {user?.created_at ? new Date(user.created_at).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" }) : "—"}
                  </p>
                </div>
                {profile?.role === "admin" && (
                  <div style={{ marginTop: "1rem" }}>
                    <a href="/admin" className="brutalist-button brutalist-button--full" style={{ textAlign: "center", textDecoration: "none" }}>
                      Enter Admin Dashboard
                    </a>
                  </div>
                )}
              </div>
            )}

            {activeTab === "Orders" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {displayOrders.map((order, idx) => (
                  <div key={idx} style={{ border: "var(--border-thick)", padding: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", background: idx % 2 === 0 ? "var(--cl-bg)" : "var(--cl-surface)" }}>
                    <div>
                      <h3 style={{ fontSize: "1.2rem", fontWeight: 600, fontFamily: "var(--font-body)" }}>
                        Order {order.id || `#${idx + 1}`}
                      </h3>
                      <p style={{ opacity: 0.6, marginTop: "0.25rem", fontSize: "0.9rem" }}>
                        {new Date(order.created_at).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" })}
                      </p>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <p style={{ fontSize: "1.3rem", fontWeight: 700 }}>₹{order.total}</p>
                      <span style={{
                        display: "inline-block", marginTop: "0.3rem", padding: "0.2rem 0.6rem",
                        fontSize: "0.75rem", textTransform: "uppercase", fontWeight: 700,
                        background: order.status === "delivered" ? "var(--cl-success)" : order.status === "shipped" ? "var(--cl-accent)" : "var(--cl-primary)",
                        color: "var(--cl-bg)",
                      }}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "Settings" && (
              <div style={{ maxWidth: "500px", display: "flex", flexDirection: "column", gap: "2rem" }}>
                <div>
                  <h3 style={{ fontSize: "1.3rem", marginBottom: "1rem" }}>Change Password</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    <input type="password" placeholder="New Password" className="input-field" />
                    <input type="password" placeholder="Confirm Password" className="input-field" />
                    <button className="brutalist-button" style={{ alignSelf: "flex-start" }}>Update</button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
