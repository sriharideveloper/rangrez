const fs = require('fs');
let code = fs.readFileSync('app/admin/reviews/AdminReviewsClient.jsx', 'utf8');

code = code.replace('const [bulkJson, setBulkJson] = useState("");', \const [bulkJson, setBulkJson] = useState("");
  const [isSingleOpen, setIsSingleOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", role: "Verified Buyer", rating: 5, content: "", is_featured: false });\);

code = code.replace('const handleBulkSubmit = async (e) => {', \
  const handleSingleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const payload = {
        name: formData.name.trim(),
        role: formData.role.trim() || 'Verified Buyer',
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

  const handleBulkSubmit = async (e) => {\);

code = code.replace('        <button onClick={() => setIsBulkOpen(true)} className="brutalist-button brutalist-button--outline brutalist-button--sm" style={{ padding: "0.8rem 1.2rem" }}>', 
\        <div style={{ display: "flex", gap: "1rem" }}>
          <button onClick={() => setIsSingleOpen(true)} className="brutalist-button brutalist-button--sm" style={{ padding: "0.8rem 1.2rem" }}>
            Add Testimonial
          </button>
          <button onClick={() => setIsBulkOpen(true)} className="brutalist-button brutalist-button--outline brutalist-button--sm" style={{ padding: "0.8rem 1.2rem" }}>\);

code = code.replace('        </button>\n      </div>\n\n      <AnimatePresence>', 
\        </button>
        </div>
      </div>

      <AnimatePresence>
        {isSingleOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} data-lenis-prevent="true" style={{ background: "var(--cl-bg)", color: "var(--cl-text)", width: "100%", maxWidth: "600px", maxHeight: "90vh", overflowY: "auto", scrollbarWidth: "none", msOverflowStyle: "none", border: "var(--border-thick)", boxShadow: "var(--shadow-brutal)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "1.5rem", borderBottom: "var(--border-thick)" }}>
                <h2 style={{ fontSize: "1.5rem" }}>Add Manual Testimonial</h2>
                <button onClick={() => setIsSingleOpen(false)}><X size={24} /></button>
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
                  <input type="checkbox" style={{ width: "1.2rem", height: "1.2rem", accentColor: "var(--cl-primary)" }} checked={formData.is_featured} onChange={e => setFormData({...formData, is_featured: e.target.checked})} />
                  <label className="input-label" style={{ marginBottom: 0 }}>Feature on Homepage?</label>
                </div>
                <button type="submit" disabled={loading} className="brutalist-button brutalist-button--sm" style={{ marginTop: "1rem" }}>
                  {loading ? "Saving..." : "Save Testimonial"}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}\);

fs.writeFileSync('app/admin/reviews/AdminReviewsClient.jsx', code);
