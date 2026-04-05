"use client";

import { motion } from "framer-motion";
import { Package, ExternalLink, RefreshCw, Truck } from "lucide-react";
import { updateOrderDetails } from "../../../lib/supabase/orders";
import { useState } from "react";

export default function AdminOrdersClient({ initialOrders }) {
  const [orders, setOrders] = useState(initialOrders || []);
  const [filter, setFilter] = useState("all");
  const [loadingId, setLoadingId] = useState(null);

  // New state handling DTDC tracking modifications
  const [trackingNumberInput, setTrackingNumberInput] = useState({});

  const filtered = filter === "all" ? orders : orders.filter(o => (o.order_status || 'processing') === filter);

  const handleUpdate = async (orderId, newStatus, currentTracking) => {
    setLoadingId(orderId);
    
    // Auto-update shipped_at logic
    const updates = { order_status: newStatus };
    if (newStatus === "shipped") {
       updates.shipped_at = new Date().toISOString();
    }
    if (newStatus === "delivered") {
       updates.delivered_at = new Date().toISOString();
    }
    
    const submittedTracking = trackingNumberInput[orderId] !== undefined ? trackingNumberInput[orderId] : currentTracking;
    
    if (submittedTracking) {
       updates.tracking_number = submittedTracking;
       // Standard tracking URL for DTDC
       updates.tracking_url = `https://www.dtdc.in/tracking/shipment-tracking.asp?AWBno=${submittedTracking}`;
    }

    const { success, error } = await updateOrderDetails(orderId, updates);
    if (success) {
      setOrders(orders.map(o => 
        o.id === orderId ? { ...o, ...updates } : o
      ));
    } else {
      alert("Failed to update: " + error);
    }
    setLoadingId(null);
  };

  const handleTrackingChange = (orderId, val) => {
    setTrackingNumberInput(prev => ({...prev, [orderId]: val}));
  };

  const exportToCSV = () => {
    const headers = ["Order ID", "Date", "Customer Email", "Customer Phone", "Customer Name", "Total Amount (INR)", "Status", "Tracking Number", "Courier URL"];
    const rows = [headers.join(",")];
    
    filtered.forEach(o => {
      const row = [
        o.id,
        new Date(o.created_at).toLocaleDateString(),
        `"${o.customer_email || o.users?.email || ""}"`,
        `"${o.customer_phone || o.shipping_address?.phone || ""}"`,
        `"${o.customer_name || ""}"`,
        o.total_amount || 0,
        o.order_status || "processing",
        `"${o.tracking_number || ""}"`,
        `"${o.tracking_url || ""}"`
      ];
      rows.push(row.join(","));
    });

    const blob = new Blob([rows.join("\n")], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("hidden", "");
    a.setAttribute("href", url);
    a.setAttribute("download", `Rangrez_Orders_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
        <h1 style={{ fontSize: "2rem", fontFamily: "var(--font-heading)", textTransform: "uppercase" }}>Orders</h1>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
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
          <button 
            onClick={exportToCSV}
            style={{
              padding: "0.5rem 1rem", fontSize: "0.8rem", fontWeight: 600, textTransform: "uppercase",
              border: "var(--border-thick)", background: "var(--cl-accent)", color: "var(--cl-bg)", cursor: "pointer"
            }}
          >
            Export CSV
          </button>
        </div>
      </div>

      <div style={{ border: "var(--border-thick)", overflow: "hidden" }}>       
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1.5fr 1.2fr 1fr 1fr", padding: "0.75rem 1.5rem", background: "var(--cl-text)", color: "var(--cl-bg)", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>
          <span>Order Info</span><span>Customer / Address</span><span>Tracking (DTDC)</span><span>Total</span><span>Status</span>
        </div>
        {filtered.map((order, i) => (
          <motion.div
            key={order.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.05 }}
            style={{
              display: "grid", gridTemplateColumns: "1.2fr 1.5fr 1.2fr 1fr 1fr",
              padding: "1rem 1.5rem", alignItems: "start", fontSize: "0.9rem", 
              borderTop: i > 0 ? "1px solid var(--cl-muted)" : "none",
            }}
          >
            {/* Column 1: Order Info */}
            <div style={{display: 'flex', flexDirection: 'column'}}>
              <span style={{ fontSize: "0.8rem", opacity: 0.8 }}>ID: {order.id?.slice(0, 8)}</span>
              <span style={{ fontSize: "0.8rem" }}>{new Date(order.created_at).toLocaleDateString()}</span>
              {order.payment_status === "paid" ? 
                 <span style={{ fontSize: "0.7rem", color: "var(--cl-success)", fontWeight: "bold" }}>PAID</span> : 
                 <span style={{ fontSize: "0.7rem", opacity: 0.6, fontWeight: "bold" }}>{order.payment_status?.toUpperCase()}</span>
              }
            </div>

            {/* Column 2: Customer / Address */}
            <div style={{display: 'flex', flexDirection: 'column', gap: '0.2rem'}}>
              <span style={{ fontWeight: 600 }}>{order.customer_name || order.users?.email || order.shipping_address?.email || "N/A"}</span>
              <span style={{ fontSize: "0.8rem" }}>{order.customer_phone || order.shipping_address?.phone}</span>
              <span style={{ opacity: 0.6, fontSize: "0.8rem", textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden", paddingRight: "1rem" }}>       
                {order.shipping_address?.city}, {order.shipping_address?.state}   
              </span>
            </div>

            {/* Column 3: Tracking Setup */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', fontWeight: 'bold' }}>
                <Truck size={14} /> DTDC Tracking
              </div>
              <input 
                type="text" 
                placeholder="Enter AWB no."
                value={trackingNumberInput[order.id] !== undefined ? trackingNumberInput[order.id] : (order.tracking_number || "") }
                onChange={(e) => handleTrackingChange(order.id, e.target.value)}
                style={{
                  padding: "0.2rem 0.4rem", fontSize: "0.8rem", border: "1px solid var(--cl-muted)", outline: "none", width: "90%"
                }}
              />
              {order.tracking_url && (
                <a href={order.tracking_url} target="_blank" rel="noreferrer" style={{fontSize: "0.7rem", color: "var(--cl-accent)", textDecoration: "underline"}}>
                  Verify Link <ExternalLink size={10} style={{display:'inline'}}/>
                </a>
              )}
            </div>

            {/* Column 4: Totals */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
               <span style={{ fontWeight: 700 }}>₹{order.total_amount}</span>
               {Array.isArray(order.items) && <span style={{fontSize: "0.7rem", opacity: 0.6}}>{order.items.length} items</span>}
            </div>

            {/* Column 5: Status */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <select
                value={order.order_status || "processing"}
                onChange={(e) => handleUpdate(order.id, e.target.value, order.tracking_number)}  
                disabled={loadingId === order.id}
                style={{
                  padding: "0.3rem", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase",
                  background: order.order_status === "delivered" ? "var(--cl-success)" : order.order_status === "shipped" || order.order_status === "out_for_delivery" ? "var(--cl-accent)" : "var(--cl-primary)",       
                  color: "var(--cl-bg)", border: "none", cursor: "pointer", outline: "none"
                }}
              >
                <option value="processing" style={{ color: "#000", background: "#fff" }}>Processing</option>
                <option value="confirmed" style={{ color: "#000", background: "#fff" }}>Confirmed</option>
                <option value="shipped" style={{ color: "#000", background: "#fff" }}>Shipped</option>
                <option value="out_for_delivery" style={{ color: "#000", background: "#fff" }}>Out For Delivery</option>
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