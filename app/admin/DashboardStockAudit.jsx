"use client";
import { useEffect, useState } from "react";
import { Bell, List, Package, Check } from "lucide-react";

export default function DashboardStockAudit() {
  const [notifications, setNotifications] = useState([]);
  const [stockLog, setStockLog] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const notifRes = await fetch("/api/admin/notifications");
      const notifData = await notifRes.json();
      setNotifications(notifData.notifications || []);
      const logRes = await fetch("/api/admin/stock-log");
      const logData = await logRes.json();
      setStockLog(logData.stock_log || []);
      setLoading(false);
    }
    fetchData();
  }, []);

  return (
    <section style={{ marginBottom: "2.5rem" }}>
      <h2 style={{ fontSize: "1.2rem", fontWeight: 700, textTransform: "uppercase", marginBottom: "1.2rem" }}>
        <Bell size={20} style={{ marginRight: 8, verticalAlign: "middle" }} /> Stock & Notifications
      </h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        {/* Notifications */}
        <div style={{ background: "var(--cl-warning)", borderRadius: 8, padding: "1.2rem", boxShadow: "0 2px 8px #0001", minWidth: 0 }}>
          <div style={{ fontWeight: 600, marginBottom: 8 }}>Low/Out-of-Stock Alerts</div>
          {loading ? <div>Loading...</div> : notifications.length === 0 ? <div style={{ opacity: 0.7 }}>No alerts.</div> : (
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
              {notifications.map(n => (
                <li key={n.id} style={{ display: "flex", alignItems: "center", gap: 8, background: n.is_read ? "#fff7e6" : "#fff3cd", borderRadius: 6, padding: "0.7rem 1rem" }}>
                  <Bell size={16} style={{ color: n.is_read ? "#aaa" : "#d97706" }} />
                  <span style={{ flex: 1, fontWeight: 500 }}>{n.message}</span>
                  <span style={{ fontSize: 12, opacity: 0.7 }}>{new Date(n.created_at).toLocaleString()}</span>
                  {n.is_read && <Check size={14} style={{ color: "#aaa" }} />}
                </li>
              ))}
            </ul>
          )}
        </div>
        {/* Stock Log */}
        <div style={{ background: "var(--cl-surface)", borderRadius: 8, padding: "1.2rem", boxShadow: "0 2px 8px #0001", minWidth: 0 }}>
          <div style={{ fontWeight: 600, marginBottom: 8 }}>Recent Stock Changes</div>
          {loading ? <div>Loading...</div> : stockLog.length === 0 ? <div style={{ opacity: 0.7 }}>No stock changes.</div> : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                <thead>
                  <tr style={{ background: "#f6f6f6" }}>
                    <th style={{ textAlign: "left", padding: 8 }}>Product</th>
                    <th style={{ textAlign: "left", padding: 8 }}>Change</th>
                    <th style={{ textAlign: "left", padding: 8 }}>Old</th>
                    <th style={{ textAlign: "left", padding: 8 }}>New</th>
                    <th style={{ textAlign: "left", padding: 8 }}>Reason</th>
                    <th style={{ textAlign: "left", padding: 8 }}>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {stockLog.map(log => (
                    <tr key={log.id} style={{ background: log.change < 0 ? "#fff0f0" : "#f0fff0" }}>
                      <td style={{ padding: 8 }}>{log.product_id}</td>
                      <td style={{ padding: 8, color: log.change < 0 ? "#d32f2f" : "#388e3c", fontWeight: 600 }}>{log.change}</td>
                      <td style={{ padding: 8 }}>{log.old_stock}</td>
                      <td style={{ padding: 8 }}>{log.new_stock}</td>
                      <td style={{ padding: 8 }}>{log.reason}</td>
                      <td style={{ padding: 8, fontSize: 12, opacity: 0.7 }}>{new Date(log.created_at).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
