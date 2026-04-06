"use client";

import { useState } from "react";
import { User, Shield, ShieldAlert, Check } from "lucide-react";
import { createClient } from "../../../lib/supabase/client";

export default function AdminUsersClient({ initialUsers, currentUser }) {
  const initialAdminsCount = initialUsers.filter(u => u.role === "admin").length;

  const [users, setUsers] = useState(initialUsers);
  const [adminCount, setAdminCount] = useState(initialAdminsCount);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleRoleChange = async (userId, currentRole) => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    if (currentRole === "admin" && userId === currentUser.id) {
       if (!confirm("Are you sure you want to remove your own admin rights? You will lose access immediately.")) {
         return;
       }
    } else if (newRole === "admin") {
       if (!confirm("Are you sure you want to grant this person Admin access? They will have full control over the website.")) {
         return;
       }
    }

    setLoading(true);
    // Call the security definer RPC function!
    const { error } = await supabase.rpc("set_user_role", { 
      target_user_id: userId, 
      new_role: newRole 
    });

    if (error) {
       alert("Failed to update role. Please run the setup SQL.");
       console.error(error);
    } else {
       alert("Role updated successfully!");
       
       setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
       
       setAdminCount(prev => newRole === "admin" ? prev + 1 : prev - 1);
       if (userId === currentUser.id && newRole === "user") {
          window.location.href = "/";
       }
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: "1000px" }}>
      <header style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2rem", fontFamily: "var(--font-heading)", textTransform: "uppercase" }}>Users & Roles</h1>
        <p style={{ opacity: 0.6, marginTop: "0.5rem" }}>Manage who has Admin access to the system.</p>
        <div style={{ marginTop: "1.5rem", padding: "1rem", background: "rgba(164, 74, 63, 0.1)", border: "1px solid var(--cl-primary)", borderRadius: "var(--radius-md)", fontSize: "0.85rem", display: "flex", gap: "1rem", alignItems: "flex-start" }}>
           <ShieldAlert size={20} color="var(--cl-primary)" style={{ flexShrink: 0 }} />
           <div>
              <strong style={{ color: "var(--cl-primary)", display: "block", marginBottom: "0.25rem" }}>Fool-proof Security Note</strong>
              Role assignments are strictly protected by a Postgres Security Definer function. Only existing Admins can promote/demote others. (If the system has 0 Admins, the first person to attempt an assignment will automatically become an Admin to bootstrap the site).
           </div>
        </div>
      </header>

      <div style={{ background: "var(--cl-surface)", border: "var(--border-thin)", borderRadius: "var(--radius-lg)", overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "3fr 2fr 1fr", gap: "1rem", padding: "1.5rem", borderBottom: "var(--border-thin)", opacity: 0.5, fontSize: "0.8rem", textTransform: "uppercase", fontWeight: 800 }}>
          <div>User</div>
          <div>Joined</div>
          <div style={{ textAlign: "right" }}>Actions</div>
        </div>

        {users.length === 0 ? (
          <div style={{ padding: "3rem", textAlign: "center", opacity: 0.5 }}>No users found.</div>
        ) : (
          users.map((user) => (
            <div key={user.id} style={{ display: "grid", gridTemplateColumns: "3fr 2fr 1fr", gap: "1rem", padding: "1.5rem", borderBottom: "1px solid rgba(255,255,255,0.05)", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem", overflow: "hidden" }}>
                {user.avatar_url ? (
                  <img src={user.avatar_url} alt={user.full_name} style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover" }} />
                ) : (
                  <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "var(--cl-bg)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(255,255,255,0.1)" }}>
                     <User size={18} opacity={0.5} />
                  </div>
                )}
                <div style={{ overflow: "hidden" }}>
                  <div style={{ fontWeight: 800, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                     {user.full_name || "Anonymous User"}
                  </div>
                  {user.role === "admin" && (
                     <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", color: "var(--cl-primary)", fontSize: "0.7rem", fontWeight: 800, marginTop: "0.25rem", textTransform: "uppercase" }}>
                        <Shield size={12} /> Admin
                     </div>
                  )}
                </div>
              </div>
              
              <div style={{ fontSize: "0.85rem", opacity: 0.6 }}>
                 {new Date(user.created_at).toLocaleDateString()}
              </div>
              
              <div style={{ textAlign: "right" }}>
                <button 
                  onClick={() => handleRoleChange(user.id, user.role)}
                  disabled={user.role === "admin" && adminCount <= 1}
                  className="brutalist-button"
                  style={{ 
                     padding: "0.5rem 1rem", fontSize: "0.75rem", 
                     background: user.role === "admin" ? "transparent" : "var(--cl-primary)",
                     color: (user.role === "admin" && adminCount <= 1) ? "gray" : (user.role === "admin" ? "var(--cl-text)" : "#fff"),
                     border: user.role === "admin" ? "var(--border-thin)" : "none",
                     opacity: loading || (user.role === "admin" && adminCount <= 1) ? 0.5 : 1, 
                     pointerEvents: loading || (user.role === "admin" && adminCount <= 1) ? "none" : "auto"
                  }}
                >
                  {user.role === "admin" ? "Revoke Admin" : "Make Admin"}
                </button>
                {user.role === "admin" && adminCount <= 1 && (
                  <div style={{ fontSize: "0.65rem", color: "var(--cl-primary)", marginTop: "0.5rem", opacity: 0.8 }}>
                    More than 1 admin required
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}