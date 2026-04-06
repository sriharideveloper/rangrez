
"use client";

import { useState } from "react";
import { createClient } from "../../lib/supabase/client";

export default function AdminManagementClient() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("admin");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpdateRole = async () => {
    if (!email) return;
    setLoading(true);
    setMessage("");
    const supabase = createClient();
    
    if (role === "user") {
      const { count, error: countErr } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .eq("role", "admin");
        
      if (countErr || count <= 1) {
        setMessage("Cannot demote the last remaining admin account.");
        setLoading(false);
        return;
      }
    }
    
    const { data, error } = await supabase.rpc("set_admin_role_by_email", { p_email: email, p_role: role });
    
    if (error) {
      setMessage("Server error: ensure you ran the secure SQL setup");
    } else {
      if (data === "Success") {
        setMessage("Updated role successfully!");
      } else {
        setMessage(String(data));
      }
    }
    setLoading(false);
  };

  return (
    <div style={{ border: "var(--border-thick)", padding: "1.5rem", marginTop: "2rem", background: "var(--cl-surface)" }}>
      <h2 style={{ fontSize: "1.3rem", fontWeight: 700, textTransform: "uppercase", marginBottom: "1rem" }}>Manage Admins</h2>
      <p style={{ fontSize: "0.8rem", opacity: 0.7, marginBottom: "1rem" }}>Promote or restrict user access by their registered email address.</p>
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
        <input 
          type="email" 
          placeholder="User Email" 
          value={email} 
          onChange={e=>setEmail(e.target.value)} 
          style={{ padding: "0.5rem", border: "1px solid var(--cl-muted)", outline: "none", minWidth: "250px" }} 
        />
        <select 
          value={role} 
          onChange={e=>setRole(e.target.value)} 
          style={{ padding: "0.5rem", border: "1px solid var(--cl-muted)", outline: "none" }}
        >
          <option value="admin">Make Admin</option>
          <option value="user">Demote to User</option>
        </select>
        <button 
          onClick={handleUpdateRole} 
          disabled={loading} 
          style={{ background: "var(--cl-text)", color: "var(--cl-bg)", padding: "0.5rem 1rem", fontWeight: 600, border: "none", cursor: "pointer" }}
        >
          {loading ? "Updating..." : "Update Role"}
        </button>
      </div>
      {message && <p style={{ marginTop: "1rem", fontSize: "0.9rem", fontWeight: "bold" }}>{message}</p>}
    </div>
  );
}
