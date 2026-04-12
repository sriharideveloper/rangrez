"use client";

import { motion } from "framer-motion";
import { Package, ExternalLink, RefreshCw, Truck } from "lucide-react";
import { updateOrderDetails } from "../../../lib/supabase/orders";
import { useState } from "react";
import AdminExport from "../../../components/AdminExport";

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
    <div className="admin-orders-page">
      <div className="admin-orders-header">
        <h1>Orders</h1>
        <div className="admin-orders-actions">
          <div className="admin-filters">
            {["all", "processing", "shipped", "delivered"].map(s => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`filter-btn ${filter === s ? 'active' : ''}`}
              >
                {s}
              </button>
            ))}
          </div>
          <button onClick={exportToCSV} className="export-btn">
            Export CSV
          </button>
        </div>
      </div>

      <div className="admin-data-container">       
        <div className="admin-header-row">
          <span>Order Info</span>
          <span>Customer & Address</span>
          <span>Tracking (DTDC)</span>
          <span>Total</span>
          <span>Status</span>
        </div>
        
        <div className="admin-orders-list">
          {filtered.map((order, i) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="admin-order-card"
            >
              {/* Column 1: Order Info */}
              <div className="order-col">
                <div className="mobile-label">Order Info</div>
                <div className="order-id">ID: {order.id?.slice(0, 8)}</div>
                <div className="order-date">{new Date(order.created_at).toLocaleDateString()}</div>
                {order.payment_status === "paid" ? 
                  <div className="order-payment paid">PAID</div> : 
                  <div className="order-payment unpaid">{order.payment_status?.toUpperCase()}</div>
                }
              </div>

              {/* Column 2: Customer / Address */}
              <div className="order-col">
                <div className="mobile-label">Customer & Address</div>
                <div className="customer-name">{order.customer_name || order.users?.email || order.shipping_address?.email || "N/A"}</div>
                <div className="customer-phone">{order.customer_phone || order.shipping_address?.phone}</div>
                <div className="customer-address">       
                  {order.shipping_address?.city}, {order.shipping_address?.state}   
                </div>
              </div>

              {/* Column 3: Tracking Setup */}
              <div className="order-col">
                <div className="mobile-label">Tracking Info</div>
                <div className="tracking-header">
                  <Truck size={14} /> DTDC Tracking
                </div>
                <div className="tracking-input-group">
                  <input 
                    type="text" 
                    placeholder="Enter AWB no."
                    value={trackingNumberInput[order.id] !== undefined ? trackingNumberInput[order.id] : (order.tracking_number || "") }
                    onChange={(e) => handleTrackingChange(order.id, e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => handleUpdate(order.id, order.order_status || "processing", order.tracking_number)}
                  >
                    SAVE
                  </button>
                </div>
                {order.tracking_url && (
                  <a href={order.tracking_url} target="_blank" rel="noreferrer" className="tracking-link">
                    Verify Link <ExternalLink size={10} style={{display:'inline'}}/>
                  </a>
                )}
              </div>

              {/* Column 4: Totals */}
              <div className="order-col">
                <div className="mobile-label">Total Amount</div>
                <div className="order-total">₹{order.total_amount}</div>
                {Array.isArray(order.items) && <div className="order-items">{order.items.length} items</div>}
              </div>

              {/* Column 5: Status */}
              <div className="order-col status-col">
                <div className="mobile-label">Order Status</div>
                <div className="status-action-group">
                  <select
                    value={order.order_status || "processing"}
                    onChange={(e) => handleUpdate(order.id, e.target.value, order.tracking_number)}  
                    disabled={loadingId === order.id}
                    className={`status-select status-${(order.order_status || "processing").replace(/_/g, '-')}`}
                  >
                    <option value="processing">Processing</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="shipped">Shipped</option>
                    <option value="out_for_delivery">Out For Delivery</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  {loadingId === order.id && <RefreshCw size={14} className="spin" />}
                </div>
              </div>
            </motion.div>
          ))}
          {filtered.length === 0 && (
            <div className="empty-state">No orders found.</div>
          )}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin { 100% { transform: rotate(360deg); } }
        .spin { animation: spin 1s linear infinite; }
        
        .admin-orders-page {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .admin-orders-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1.5rem;
        }

        .admin-orders-header h1 {
          font-size: 2rem;
          font-family: var(--font-heading);
          text-transform: uppercase;
          margin: 0;
        }

        .admin-orders-actions {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
          align-items: center;
        }

        .admin-filters {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .filter-btn, .export-btn {
          padding: 0.5rem 1rem;
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
          border: var(--border-thick, 2px solid var(--cl-text));
          cursor: pointer;
          transition: all 0.2s ease;
          border-radius: 4px;
        }

        .filter-btn {
          background: transparent;
          color: var(--cl-text);
        }

        .filter-btn.active {
          background: var(--cl-text);
          color: var(--cl-bg);
        }

        .filter-btn:hover:not(.active) {
          background: rgba(0,0,0,0.05);
        }

        .export-btn {
          background: var(--cl-accent, #c9a050);
          color: #fff;
          border-color: var(--cl-accent, #c9a050);
        }
        .export-btn:hover {
          opacity: 0.9;
        }

        /* Desktop Table Layout */
        .admin-data-container {
          background: var(--cl-surface, #fff);
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        }

        .admin-header-row {
          display: grid;
          grid-template-columns: 1.2fr 1.5fr 1.2fr 1fr 1fr;
          padding: 1rem 1.5rem;
          background: var(--cl-text);
          color: var(--cl-bg);
          font-size: 0.8rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          gap: 1rem;
        }

        .admin-orders-list {
          display: flex;
          flex-direction: column;
        }

        .admin-order-card {
          display: grid;
          grid-template-columns: 1.2fr 1.5fr 1.2fr 1fr 1fr;
          padding: 1.5rem;
          align-items: start;
          gap: 1rem;
          border-bottom: 1px solid var(--cl-muted, #eee);
          transition: background 0.2s ease;
        }

        .admin-order-card:hover {
          background: rgba(0,0,0,0.01);
        }
        
        .admin-order-card:last-child {
          border-bottom: none;
        }

        .order-col {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .mobile-label {
          display: none;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          color: var(--cl-text);
          opacity: 0.6;
          margin-bottom: 0.25rem;
        }

        .order-id { font-size: 0.85rem; opacity: 0.8; font-family: monospace; }
        .order-date { font-size: 0.85rem; }
        .order-payment { font-size: 0.7rem; font-weight: 700; margin-top: 0.2rem; }
        .order-payment.paid { color: var(--cl-success, #2e7d32); }
        .order-payment.unpaid { opacity: 0.6; }

        .customer-name { font-weight: 600; font-size: 0.95rem; }
        .customer-phone { font-size: 0.85rem; opacity: 0.8; }
        .customer-address {
          font-size: 0.85rem;
          opacity: 0.6;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .tracking-header {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.8rem;
          font-weight: 600;
          margin-bottom: 0.2rem;
        }

        .tracking-input-group {
          display: flex;
          gap: 0;
          border: 1px solid var(--cl-muted, #ccc);
          border-radius: 4px;
          overflow: hidden;
        }

        .tracking-input-group input {
          flex: 1;
          padding: 0.4rem 0.5rem;
          font-size: 0.8rem;
          border: none;
          outline: none;
          min-width: 0;
        }

        .tracking-input-group button {
          padding: 0.4rem 0.8rem;
          font-size: 0.75rem;
          font-weight: 700;
          background: var(--cl-text);
          color: var(--cl-bg);
          border: none;
          cursor: pointer;
        }

        .tracking-link {
          font-size: 0.75rem;
          color: var(--cl-accent, #c9a050);
          text-decoration: underline;
          margin-top: 0.2rem;
          display: inline-flex;
          align-items: center;
          gap: 0.2rem;
        }

        .order-total { font-weight: 700; font-size: 1rem; }
        .order-items { font-size: 0.8rem; opacity: 0.6; }

        .status-action-group {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .status-select {
          padding: 0.4rem 0.5rem;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          outline: none;
          color: #fff;
          appearance: none;
        }

        .status-select option {
          background: #fff;
          color: #000;
        }

        .status-processing { background: var(--cl-primary, #666); }
        .status-confirmed { background: #1976d2; }
        .status-shipped, .status-out-for-delivery { background: var(--cl-accent, #f57c00); }
        .status-delivered { background: var(--cl-success, #2e7d32); }
        .status-cancelled { background: #d32f2f; }

        .empty-state {
          padding: 3rem;
          text-align: center;
          opacity: 0.5;
          font-size: 1.1rem;
        }

        /* Mobile Layout */
        @media (max-width: 900px) {
          .admin-orders-actions {
            flex-direction: column;
            align-items: stretch;
            width: 100%;
          }
          .admin-filters {
            display: grid;
            grid-template-columns: 1fr 1fr;
            width: 100%;
          }
          .filter-btn {
            width: 100%;
            text-align: center;
          }
          .export-btn {
            width: 100%;
          }
          
          .admin-data-container {
            background: transparent;
            box-shadow: none;
          }

          .admin-header-row {
            display: none;
          }

          .admin-order-card {
            display: flex;
            flex-direction: column;
            background: var(--cl-surface, #fff);
            padding: 1.5rem;
            margin-bottom: 1rem;
            border-radius: 8px;
            border: 1px solid var(--cl-muted, #eee);
            box-shadow: 0 2px 8px rgba(0,0,0,0.04);
            gap: 1.25rem;
          }

          .order-col {
            width: 100%;
          }

          .mobile-label {
            display: block;
          }

          .customer-address {
            white-space: normal;
          }

          .status-col {
            padding-top: 1rem;
            border-top: 1px dashed var(--cl-muted, #eee);
          }
        }
      `}} />
    </div>
  );
}
