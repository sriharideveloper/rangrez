"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Mail, Check, X } from "lucide-react";
import { deleteMessage, markMessageRead } from "../../../lib/supabase/engagement";

export default function AdminMessagesClient({ initialMessages }) {
  const [messages, setMessages] = useState(initialMessages);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this message?")) return;
    const { success } = await deleteMessage(id);
    if (success) {
      setMessages(messages.filter(m => m.id !== id));
    }
  };

  const handleMarkRead = async (id) => {
    const { success } = await markMessageRead(id);
    if (success) {
      setMessages(messages.map(m => m.id === id ? { ...m, read: true } : m));
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2rem", fontFamily: "var(--font-heading)", textTransform: "uppercase" }}>Inbox</h1>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {messages.map((m, i) => (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            style={{ 
              border: "var(--border-thick)", 
              padding: "1.5rem", 
              background: m.read ? "var(--cl-surface)" : "var(--cl-secondary)", 
              display: "flex", 
              flexDirection: "column", 
              gap: "1rem" 
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <h3 style={{ fontSize: "1.2rem", fontWeight: 700 }}>{m.name || "Anonymous User"}</h3>
                <p style={{ display: "flex", alignItems: "center", gap: "0.25rem", opacity: 0.7, fontSize: "0.85rem" }}>
                  <Mail size={14} /> {m.email}
                </p>
              </div>
              <span style={{ fontSize: "0.8rem", opacity: 0.6 }}>
                {new Date(m.created_at).toLocaleString()}
              </span>
            </div>
            
            <p style={{ fontSize: "1rem", lineHeight: 1.5 }}>
              {m.message}
            </p>

            <div style={{ borderTop: "1px dashed var(--cl-muted)", paddingTop: "1rem", display: "flex", justifyContent: "space-between", marginTop: "auto" }}>
              {!m.read ? (
                <button onClick={() => handleMarkRead(m.id)} style={{ fontSize: "0.85rem", fontWeight: 600, display: "flex", alignItems: "center", gap: "0.25rem" }}>
                  <Check size={14} /> Mark as Read
                </button>
              ) : (
                <span style={{ fontSize: "0.85rem", opacity: 0.5 }}>Read</span>
              )}

              <button onClick={() => handleDelete(m.id)} style={{ fontSize: "0.85rem", color: "var(--cl-danger)", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                <Trash2 size={14} /> Delete
              </button>
            </div>
          </motion.div>
        ))}
        {messages.length === 0 && (
          <div style={{ padding: "3rem", textAlign: "center", opacity: 0.5 }}>Inbox is zero. Good job!</div>
        )}
      </div>
    </div>
  );
}
