"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Star, Upload, X } from "lucide-react";
import { deleteReview, upsertBulkReviews } from "../../actions/admin";

export default function AdminReviewsClient({ initialReviews }) {
  const [reviews, setReviews] = useState(initialReviews);
  const [isBulkOpen, setIsBulkOpen] = useState(false);
  const [isSingleOpen, setIsSingleOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", role: "Verified Buyer", rating: 5, content: "", is_featured: false });
  const [bulkJson, setBulkJson] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this review permanently?")) return;
    const { success, error } = await deleteReview(id);
    if (success) {
      setReviews(reviews.filter(r => r.id !== id));
    } else {
      alert(error);
    }
  };

  const handleSingleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const payload = {
        name: formData.name.trim(),
        role: formData.role.trim() || "Verified Buyer",
        rating: Math.min(Math.max(Number(formData.rating), 1), 5),
        content: formData.content.trim(),
        is_featured: formData.is_featured
      };
      const res = await upsertBulkReviews([payload]);
      if (res.error) throw new Error(res.error);
      window.location.reload();
    } catch (err) {
      alert("Error adding testimonial: " + err.message);
      setLoading(false);
    }
  };

  const handleBulkSubmit = async (e) => {
    e.preventDefault();
    try {
      const parsed = JSON.parse(bulkJson);
      if (!Array.isArray(parsed)) throw new Error("JSON must be an array of objects.");
      setLoading(true);
      
      const res = await upsertBulkReviews(parsed);
      if (res.error) throw new Error(res.error);
      
      window.location.reload(); 
    } catch (err) {
      alert("Import Failed: " + err.message);
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="admin-header-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2rem", fontFamily: "var(--font-heading)", textTransform: "uppercase" }}>Testimonials</h1>
        <div style={{ display: "flex", gap: "1rem" }}>
          <button onClick={() => setIsSingleOpen(true)} className="brutalist-button brutalist-button--sm" style={{ padding: "0.8rem 1.2rem" }}>
            Add Manual Testimonial
          </button>
          <button onClick={() => setIsBulkOpen(true)} className="brutalist-button brutalist-button--outline brutalist-button--sm" style={{ padding: "0.8rem 1.2rem" }}>
            JSON Bulk Import
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isSingleOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} data-lenis-prevent="true" style={{ background: "var(--cl-bg)", color: "var(--cl-text)", width: "100%", maxWidth: "600px", maxHeight: "90vh", overflowY: "auto", scrollbarWidth: "none", msOverflowStyle: "none", border: "var(--border-thick)", boxShadow: "var(--shadow-brutal)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "1.5rem", borderBottom: "var(--border-thick)" }}>
                <h2 style={{ fontSize: "1.5rem" }}>Add Manual Testimonial</h2>
                <button type="button" onClick={() => setIsSingleOpen(false)}><X size={24} /></button>
              </div>
              <form onSubmit={handleSingleSubmit} style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "1.2rem" }}>
                <div>
                  <label className="input-label">Customer Name</label>
                  <input required className="input-field" style={{ padding: "0.8rem", fontSize: "0.9rem" }} value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div>
                  <label className="input-label">Role / Tagline</label>
                  <input className="input-field" style={{ padding: "0.8rem", fontSize: "0.9rem" }} placeholder="e.g. Verified Buyer" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} />
                </div>
                <div>
                  <label className="input-label">Rating (1-5)</label>
                  <input type="number" min="1" max="5" required className="input-field" style={{ padding: "0.8rem", fontSize: "0.9rem" }} value={formData.rating} onChange={e => setFormData({...formData, rating: e.target.value})} />
                </div>
                <div>
                  <label className="input-label">Review Content</label>
                  <textarea required className="input-field" rows={4} style={{ padding: "0.8rem", fontSize: "0.9rem" }} value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} />
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.5rem" }}>
                  <input type="checkbox" id="featureCbx" style={{ width: "1.2rem", height: "1.2rem", accentColor: "var(--cl-primary)" }} checked={formData.is_featured} onChange={e => setFormData({...formData, is_featured: e.target.checked})} />
                  <label className="input-label" htmlFor="featureCbx" style={{ marginBottom: 0 }}>Feature on Homepage?</label>
                </div>
                <button type="submit" disabled={loading} className="brutalist-button brutalist-button--sm" style={{ marginTop: "1rem" }}>
                  {loading ? "Saving..." : "Save Testimonial"}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}

        {isBulkOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} data-lenis-prevent="true" style={{ background: "var(--cl-bg)", color: "var(--cl-text)", width: "100%", maxWidth: "600px", maxHeight: "90vh", overflowY: "auto", scrollbarWidth: "none", msOverflowStyle: "none", border: "var(--border-thick)", boxShadow: "var(--shadow-brutal)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "1.5rem", borderBottom: "var(--border-thick)" }}>
                <h2 style={{ fontSize: "1.5rem" }}>Bulk Import Testimonials</h2>
                <button onClick={() => setIsBulkOpen(false)}><X size={24} /></button>
              </div>
              <form onSubmit={handleBulkSubmit} style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                <div style={{ background: "var(--cl-secondary)", padding: "1rem" }}>
                  <p style={{ opacity: 0.8, fontSize: "0.85rem", lineHeight: 1.5 }}>
                    Paste an array of JSON objects. <strong>Fields:</strong> <code>name</code>, <code>role</code>, <code>rating</code> (1-5), <code>content</code>, and optionally <code>avatar_url</code> and <code>is_featured</code> (true/false).
                  </p>
                </div>
                <textarea 
                  rows={10} 
                  className="input-field" 
                  placeholder='[ { "name": "Rida F.", "role": "Customer", "rating": 5, "content": "Amazing quality!", "is_featured": true, "avatar_url": "https..." } ]'
                  value={bulkJson} 
                  onChange={e => setBulkJson(e.target.value)} 
                />
                <button type="submit" disabled={loading} className="brutalist-button brutalist-button--sm" style={{ marginTop: "1rem" }}>
                  {loading ? "Importing..." : "Run Import"}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem" }}>
        {reviews.map((r, i) => (
          <motion.div
            key={r.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            style={{ border: "var(--border-thick)", padding: "1.5rem", background: "var(--cl-surface)", display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 700 }}>{r.name}</h3>
                {r.role && <p style={{ fontSize: "0.85rem", opacity: 0.7 }}>{r.role}</p>}
              </div>
              <div style={{ display: "flex", gap: "0.2rem" }}>
                {[...Array(5)].map((_, idx) => (
                  <Star key={idx} size={14} fill={idx < r.rating ? "var(--cl-accent)" : "transparent"} stroke={idx < r.rating ? "none" : "var(--cl-muted)"} />
                ))}
              </div>
            </div>
            
            <p style={{ fontSize: "0.95rem", opacity: 0.9, lineHeight: 1.5, fontStyle: "italic" }}>
              "{r.content}"
            </p>
            {r.is_featured && <p style={{ fontSize: "0.75rem", opacity: 0.8, color: "var(--cl-accent)", fontWeight: "bold" }}>★ Featured</p>}

            <div style={{ borderTop: "1px dashed var(--cl-muted)", paddingTop: "1rem", display: "flex", justifyContent: "flex-end", marginTop: "auto" }}>
              <button onClick={() => handleDelete(r.id)} style={{ fontSize: "0.85rem", color: "var(--cl-danger)", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                <Trash2 size={14} /> Delete
              </button>
            </div>
          </motion.div>
        ))}
        {reviews.length === 0 && (
          <div style={{ padding: "3rem", gridColumn: "1/-1", textAlign: "center", opacity: 0.5 }}>No testimonials.</div>
        )}
      </div>
    </div>
  );
}

