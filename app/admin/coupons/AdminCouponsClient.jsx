"use client";

import { useState } from "react";
import AdminExport from "../../../components/AdminExport";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Trash2 } from "lucide-react";
import { upsertCoupon, deleteCoupon } from "../../actions/admin";

export default function AdminCouponsClient({ initialCoupons }) {
  const [coupons, setCoupons] = useState(initialCoupons);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    code: "", discount_type: "percentage", discount_value: "", minimum_spend: "0", active: true, valid_from: "", valid_until: "", allowed_products: ""
  });

  const handleEdit = (c) => {
    setEditingId(c.id);
    setFormData({
      code: c.code,
      discount_type: c.discount_type,
      discount_value: c.discount_value,
      minimum_spend: c.min_order_value || 0,
      active: c.active,
      valid_from: c.valid_from ? new Date(c.valid_from).toISOString().slice(0, 16) : "",
      valid_until: c.valid_until ? new Date(c.valid_until).toISOString().slice(0, 16) : "",
      allowed_products: ""  
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
    
    // Parse allowed products from comma-separated UUIDs
    let parsedProducts = null;
    if (formData.allowed_products.trim()) {
      parsedProducts = formData.allowed_products.split(",").map(id => id.trim()).filter(id => id);
    }
    
    const payload = {
      code: formData.code.toUpperCase().replace(/\s+/g, ''),
      discount_type: formData.discount_type,
      discount_value: parseFloat(formData.discount_value),
      min_order_value: parseFloat(formData.minimum_spend),
      active: formData.active,
      valid_from: formData.valid_from ? new Date(formData.valid_from).toISOString() : null,
      valid_until: formData.valid_until ? new Date(formData.valid_until).toISOString() : null,
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
    setFormData({ code: "", discount_type: "percentage", discount_value: "", minimum_spend: "0", active: true, valid_from: "", valid_until: "", allowed_products: "" });
    setIsFormOpen(false);
  };

  return (
    <div>
      <div className="admin-header-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2rem", fontFamily: "var(--font-heading)", textTransform: "uppercase" }}>Coupons</h1>
        <button onClick={() => setIsFormOpen(true)} className="brutalist-button" style={{ padding: "0.8rem 1.5rem" }}>
          <Plus size={16} /> Create Coupon
        </button>
      </div>

      <AnimatePresence>
        {isFormOpen && (
          <motion.div onClick={(e) => { if(e.target===e.currentTarget) setIsFormOpen(false); }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
            <motion.div data-lenis-prevent="true" onClick={e => e.stopPropagation()} initial={{ scale: 0.9 }} animate={{ scale: 1 }} style={{ background: "var(--cl-bg)", color: "var(--cl-text)", width: "100%", maxWidth: "600px", maxHeight: "90vh", overflowY: "auto", overscrollBehavior: "contain", overscrollBehavior: "contain", overflowX: "hidden", display: "flex", flexDirection: "column", border: "var(--border-thick)", boxShadow: "var(--shadow-brutal)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "1.5rem", borderBottom: "var(--border-thick)" }}>
                <h2 style={{ fontSize: "1.5rem" }}>{editingId ? "Edit Coupon" : "New Coupon"}</h2>
                <button onClick={resetForm}><X size={24} /></button>
              </div>
              <form onSubmit={handleSubmit} style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                <div>
                  <label className="input-label">Coupon Code (e.g. EID50)</label>
                  <input required className="input-field" style={{ textTransform: "uppercase" }} value={formData.code} onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})} />
                </div>
                
                <div className="form-grid form-grid--2col">
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

                <div className="form-grid form-grid--2col">
                  <div>
                    <label className="input-label">Valid From (Optional)</label>
                    <input type="datetime-local" className="input-field" value={formData.valid_from} onChange={e => setFormData({...formData, valid_from: e.target.value})} />
                  </div>
                  <div>
                    <label className="input-label">Valid Until (Optional)</label>
                    <input type="datetime-local" className="input-field" value={formData.valid_until} onChange={e => setFormData({...formData, valid_until: e.target.value})} />
                  </div>
                </div>

                <div>
                  <label className="input-label">Allowed Products (Comma separated UUIDs, empty for all products)</label>
                  <textarea className="input-field" rows={2} placeholder="e.g. 5e3d..., 8f9a..." value={formData.allowed_products} onChange={e => setFormData({...formData, allowed_products: e.target.value})} />
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
            
            <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem", opacity: 0.8, fontSize: "0.85rem" }}>
              <p><strong>Discount:</strong> {c.discount_type === "percentage" ? `${c.discount_value}% OFF` : `₹${c.discount_value} OFF`}</p>
              <p><strong>Min Spend:</strong> ₹{c.minimum_spend}</p>
              {c.valid_from && <p><strong>Starts:</strong> {new Date(c.valid_from).toLocaleDateString()}</p>}
              {c.valid_until && <p><strong>Ends:</strong> {new Date(c.valid_until).toLocaleDateString()}</p>}
              {c.allowed_products?.length > 0 && <p style={{ color: "purple", fontWeight: "bold" }}>Valid on {c.allowed_products.length} product(s)</p>}
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


