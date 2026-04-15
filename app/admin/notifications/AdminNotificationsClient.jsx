"use client";
import { useState } from "react";
import { Check, Bell, X } from "lucide-react";
import { markAdminNotificationRead } from "../../../lib/supabase/admin_notifications";

export default function AdminNotificationsClient({ initialNotifications }) {
  const [notifications, setNotifications] = useState(initialNotifications);

  const handleMarkRead = async (id) => {
    const { success } = await markAdminNotificationRead(id);
    if (success) {
      setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n));
    }
  };

  return (
    <div>
      <div className="admin-header-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2rem", fontFamily: "var(--font-heading)", textTransform: "uppercase" }}>Admin Notifications</h1>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {notifications.length === 0 && <div>No notifications.</div>}
        {notifications.map((n, i) => (
          <div key={n.id} style={{
            border: "var(--border-thick)",
            padding: "1.5rem",
            background: n.is_read ? "var(--cl-surface)" : "var(--cl-warning)",
            display: "flex",
            alignItems: "center",
            gap: "1rem"
          }}>
            <Bell size={20} style={{ color: n.is_read ? '#aaa' : '#d97706' }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700 }}>{n.message}</div>
              <div style={{ fontSize: "0.85rem", opacity: 0.7 }}>{new Date(n.created_at).toLocaleString()}</div>
            </div>
            {!n.is_read && (
              <button onClick={() => handleMarkRead(n.id)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <Check size={18} />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
