"use client";

import { motion } from "framer-motion";
import { Package, ExternalLink, RefreshCw } from "lucide-react";
import { updateOrderStatus } from "../../../lib/supabase/orders";
import { useState } from "react";

export default function AdminOrdersClient({ initialOrders }) {
  const [orders, setOrders] = useState(initialOrders);
  const [filter, setFilter] = useState("all");
  const [loadingId, setLoadingId] = useState(null);

  const filtered = filter === "all" ? orders : orders.filter(o => o.status === filter);

  const handleStatusChange = async (orderId, newStatus) => {
    setLoadingId(orderId);
    const { success, error } = await updateOrderStatus(orderId, newStatus);
    if (success) {
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } else {
      alert("Failed to update status: " + error);
    }
    setLoadingId(null);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
        <h1 style={{ fontSize: "2rem", fontFamily: "var(--font-heading)", textTransform: "uppercase" }}>Orders</h1>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          {["all", "processing", "shipped", "delivered"].map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              style={{
                padding: "0.5rem 1rem", fontSize: "0.8rem", fontWeight: 600, textTransform: "uppercase",
                border: "var(--border-thick)",
                background: filter === s ? "var(--cl-text)" : "var(--cl-bg)",
                color: filter === s ? "var(--cl-bg)" : "var(--cl-text)",
                transition: "var(--transition-snap)",
              }}
            >{s}</button>
          ))}
        </div>
      </div>

      <div style={{ border: "var(--border-thick)", overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr 1.5fr 0.8fr 1fr 1fr", padding: "0.75rem 1.5rem", background: "var(--cl-text)", color: "var(--cl-bg)", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>
          <span>Order Date</span><span>Customer Email</span><span>Address</span><span>Items</span><span>Total</span><span>Status</span>
        </div>
        {filtered.map((order, i) => (
          <motion.div
            key={order.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.05 }}
            style={{
              display: "grid", gridTemplateColumns: "1fr 1.5fr 1.5fr 0.8fr 1fr 1fr",
              padding: "1rem 1.5rem", alignItems: "center", fontSize: "0.9rem",
              borderTop: i > 0 ? "1px solid var(--cl-muted)" : "none",
            }}
          >
            <span style={{ fontSize: "0.8rem" }}>{new Date(order.created_at).toLocaleDateString()}</span>
            <span style={{ fontWeight: 600 }}>{order.users?.email || order.shipping_address?.email || "N/A"}</span>
            <span style={{ opacity: 0.6, fontSize: "0.8rem", textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden", paddingRight: "1rem" }}>
              {order.shipping_address?.city}, {order.shipping_address?.state}
            </span>
            <span>{Array.isArray(order.items) ? order.items.length : 0}</span>
            <span style={{ fontWeight: 700 }}>₹{order.total}</span>
            
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <select
                value={order.status}
                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                disabled={loadingId === order.id}
                style={{
                  padding: "0.3rem", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase",
                  background: order.status === "delivered" ? "var(--cl-success)" : order.status === "shipped" ? "var(--cl-accent)" : "var(--cl-primary)",
                  color: "var(--cl-bg)", border: "none", cursor: "pointer", outline: "none"
                }}
              >
                <option value="processing" style={{ color: "#000", background: "#fff" }}>Processing</option>
                <option value="shipped" style={{ color: "#000", background: "#fff" }}>Shipped</option>
                <option value="delivered" style={{ color: "#000", background: "#fff" }}>Delivered</option>
                <option value="cancelled" style={{ color: "#000", background: "#fff" }}>Cancelled</option>
              </select>
              {loadingId === order.id && <RefreshCw size={14} className="spin" />}
            </div>
          </motion.div>
        ))}
        {filtered.length === 0 && (
           <div style={{ padding: "3rem", textAlign: "center", opacity: 0.5 }}>No orders found.</div>
        )}
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin { 100% { transform: rotate(360deg); } }
        .spin { animation: spin 1s linear infinite; }
      `}} />
    </div>
  );
}
