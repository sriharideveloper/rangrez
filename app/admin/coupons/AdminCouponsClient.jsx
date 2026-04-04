"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Trash2 } from "lucide-react";
import { upsertCoupon, deleteCoupon } from "../../actions/admin";

export default function AdminCouponsClient({ initialCoupons }) {
  const [coupons, setCoupons] = useState(initialCoupons);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    code: "", discount_type: "percentage", discount_value: "", minimum_spend: "0", active: true
  });

  const handleEdit = (c) => {
    setEditingId(c.id);
    setFormData({
      code: c.code, discount_type: c.discount_type, discount_value: c.discount_value, minimum_spend: c.minimum_spend || 0, active: c.active
    });
    setIsFormOpen(true);
  };

  const handleDelete = async (id, code) => {
    if (!window.confirm(`Are you sure you want to delete coupon ${code}?`)) return;
    const { success, error } = await deleteCoupon(id);
    if (success) {
      setCoupons(coupons.filter(c => c.id !== id));
    } else {
      alert("Error deleting coupon: " + error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const payload = {
      ...formData,
      code: formData.code.toUpperCase().replace(/\s+/g, ''),
      discount_value: parseFloat(formData.discount_value),
      minimum_spend: parseFloat(formData.minimum_spend),
      id: editingId
    };

    const { success, error } = await upsertCoupon(payload);
    
    if (success) {
      window.location.reload(); 
    } else {
      alert("Error saving coupon: " + error);
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({ code: "", discount_type: "percentage", discount_value: "", minimum_spend: "0", active: true });
    setIsFormOpen(false);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2rem", fontFamily: "var(--font-heading)", textTransform: "uppercase" }}>Coupons</h1>
        <button onClick={() => setIsFormOpen(true)} className="brutalist-button" style={{ padding: "0.8rem 1.5rem" }}>
          <Plus size={16} /> Create Coupon
        </button>
      </div>

      <AnimatePresence>
        {isFormOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} style={{ background: "var(--cl-bg)", color: "var(--cl-text)", width: "100%", maxWidth: "600px", border: "var(--border-thick)", boxShadow: "var(--shadow-brutal)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "1.5rem", borderBottom: "var(--border-thick)" }}>
                <h2 style={{ fontSize: "1.5rem" }}>{editingId ? "Edit Coupon" : "New Coupon"}</h2>
                <button onClick={resetForm}><X size={24} /></button>
              </div>
              <form onSubmit={handleSubmit} style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                <div>
                  <label className="input-label">Coupon Code (e.g. EID50)</label>
                  <input required className="input-field" style={{ textTransform: "uppercase" }} value={formData.code} onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})} />
                </div>
                
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                  <div>
                    <label className="input-label">Type</label>
                    <select className="input-field" value={formData.discount_type} onChange={e => setFormData({...formData, discount_type: e.target.value})}>
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed Amount (₹)</option>
                    </select>
                  </div>
                  <div>
                    <label className="input-label">Discount Value</label>
                    <input required type="number" step="0.01" className="input-field" value={formData.discount_value} onChange={e => setFormData({...formData, discount_value: e.target.value})} />
                  </div>
                </div>

                <div>
                  <label className="input-label">Minimum Spend (₹)</label>
                  <input required type="number" step="0.01" className="input-field" value={formData.minimum_spend} onChange={e => setFormData({...formData, minimum_spend: e.target.value})} />
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.5rem" }}>
                  <input type="checkbox" style={{ width: "1.2rem", height: "1.2rem", accentColor: "var(--cl-primary)" }} checked={formData.active} onChange={e => setFormData({...formData, active: e.target.checked})} />
                  <label className="input-label" style={{ marginBottom: 0 }}>Active</label>
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", marginTop: "1rem", borderTop: "var(--border-thick)", paddingTop: "1.5rem" }}>
                  <button type="button" onClick={resetForm} className="brutalist-button brutalist-button--outline">Cancel</button>
                  <button type="submit" disabled={loading} className="brutalist-button">
                    {loading ? "Saving..." : "Save Coupon"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem" }}>
        {coupons.map((c, i) => (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            style={{ border: "var(--border-thick)", padding: "1.5rem", background: "var(--cl-surface)", display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <h3 style={{ fontSize: "1.5rem", fontWeight: 700, fontFamily: "var(--font-heading)", textTransform: "uppercase", letterSpacing: "1px" }}>{c.code}</h3>
              <span style={{
                padding: "0.2rem 0.6rem", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase",
                background: c.active ? "var(--cl-success)" : "var(--cl-muted)", color: c.active ? "var(--cl-bg)" : "var(--cl-text)",
              }}>
                {c.active ? "Active" : "Disabled"}
              </span>
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem", opacity: 0.8 }}>
              <p><strong>Discount:</strong> {c.discount_type === "percentage" ? `${c.discount_value}% OFF` : `₹${c.discount_value} OFF`}</p>
              <p><strong>Min Spend:</strong> ₹{c.minimum_spend}</p>
            </div>

            <div style={{ borderTop: "1px dashed var(--cl-muted)", paddingTop: "1rem", display: "flex", justifyContent: "space-between", marginTop: "auto" }}>
              <button onClick={() => handleEdit(c)} style={{ fontSize: "0.85rem", textDecoration: "underline", fontWeight: 600 }}>Edit</button>
              <button onClick={() => handleDelete(c.id, c.code)} style={{ fontSize: "0.85rem", color: "var(--cl-danger)", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                <Trash2 size={14} /> Delete
              </button>
            </div>
          </motion.div>
        ))}
        {coupons.length === 0 && (
          <div style={{ padding: "3rem", gridColumn: "1/-1", textAlign: "center", opacity: 0.5 }}>No coupons generated yet.</div>
        )}
      </div>
    </div>
  );
}
