"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Upload, Trash2, ExternalLink } from "lucide-react";
import { uploadImageToStorage } from "../../../lib/supabase/clientUpload";
import { upsertProduct, deleteProduct } from "../../actions/admin";

export default function AdminProductsClient({ initialProducts }) {
  const [products, setProducts] = useState(initialProducts);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isBulkOpen, setIsBulkOpen] = useState(false);
  const [bulkJson, setBulkJson] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    title: "", slug: "", price: "", compare_at_price: "", style: "Floral", category: "Bridal", status: "In Stock", is_featured: false, description: "", image_url: "", gallery_urls: [],
  });

  const handleTitleChange = (e) => {
    const title = e.target.value;
    const generatedSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    setFormData(prev => ({
      ...prev,
      title,
      slug: editingId ? prev.slug : generatedSlug
    }));
  };

  const handleEdit = (p) => {
    setEditingId(p.id);
    setFormData({
      title: p.title, slug: p.slug, price: p.price, compare_at_price: p.compare_at_price || "", style: p.style, category: p.category, status: p.status, is_featured: p.is_featured, description: p.description || "", image_url: p.image_url || "", gallery_urls: p.images || p.gallery_urls || []
    });
    setIsFormOpen(true);
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete ${title}?`)) return;
    const { success, error } = await deleteProduct(id);
    if (success) {
      setProducts(products.filter(p => p.id !== id));
    } else {
      alert("Error deleting product: " + error);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);
    try {
      const publicUrl = await uploadImageToStorage(file);
      setFormData(prev => ({ ...prev, image_url: publicUrl }));
    } catch (err) {
      alert("File upload failed: " + err.message);
    }
    setLoading(false);
  };

  const handleGalleryChange = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setLoading(true);
    try {
      const newUrls = await Promise.all(
        files.map(file => uploadImageToStorage(file))
      );
      setFormData(prev => ({ ...prev, gallery_urls: [...(prev.gallery_urls || []), ...newUrls] }));
    } catch (err) {
      alert("Gallery upload failed: " + err.message);
    }
    setLoading(false);
  };

  const removeGalleryImage = (index) => {
    setFormData(prev => ({
      ...prev,
      gallery_urls: prev.gallery_urls.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const payload = {
      ...formData,
      price: parseFloat(formData.price),
      compare_at_price: formData.compare_at_price ? parseFloat(formData.compare_at_price) : null,
      id: editingId,
      images: formData.gallery_urls
    };
    delete payload.gallery_urls;

    const { success, error } = await upsertProduct(payload);
    
    if (success) {
      // Optimiztic update or trigger a refresh via router
      window.location.reload(); 
    } else {
      alert("Error saving product: " + error);
      setLoading(false);
    }
  };

  const handleBulkSubmit = async (e) => {
    e.preventDefault();
    if (!bulkJson) return;
    try {
      const parsed = JSON.parse(bulkJson);
      if (!Array.isArray(parsed)) throw new Error("JSON must be an array of product objects.");
      setLoading(true);
      
      for (const item of parsed) {
        if (!item.title || !item.price) continue;
        await upsertProduct({
          title: item.title,
          slug: item.slug || item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
          price: parseFloat(item.price),
          compare_at_price: item.compare_at_price ? parseFloat(item.compare_at_price) : null,
          category: item.category || "Everyday",
          style: item.style || "Floral",
          status: item.status || "In Stock",
          is_featured: !!item.is_featured,
          description: item.description || "",
          image_url: item.image_url || item.image || "",
          images: Array.isArray(item.gallery_urls) ? item.gallery_urls : (Array.isArray(item.images) ? item.images : [])
        });
      }
      window.location.reload(); 
    } catch (err) {
      alert("Import Failed: " + err.message);
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({ title: "", slug: "", price: "", compare_at_price: "", style: "Floral", category: "Bridal", status: "In Stock", is_featured: false, description: "", image_url: "", gallery_urls: [] });
    setIsFormOpen(false);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2rem", fontFamily: "var(--font-heading)", textTransform: "uppercase" }}>Products</h1>
        <div style={{ display: "flex", gap: "1rem" }}>
          <button onClick={() => setIsBulkOpen(true)} className="brutalist-button brutalist-button--outline" style={{ padding: "0.8rem 1.5rem" }}>
            JSON Bulk Import
          </button>
          <button onClick={() => setIsFormOpen(true)} className="brutalist-button" style={{ padding: "0.8rem 1.5rem" }}>
            <Plus size={16} /> Add Product
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isBulkOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} style={{ background: "var(--cl-bg)", color: "var(--cl-text)", width: "100%", maxWidth: "600px", border: "var(--border-thick)", boxShadow: "var(--shadow-brutal)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "1.5rem", borderBottom: "var(--border-thick)" }}>
                <h2 style={{ fontSize: "1.5rem" }}>Bulk Import via JSON</h2>
                <button onClick={() => setIsBulkOpen(false)}><X size={24} /></button>
              </div>
              <form onSubmit={handleBulkSubmit} style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                <p style={{ opacity: 0.8, fontSize: "0.9rem", lineHeight: 1.5 }}>
                  Paste an array of JSON objects. Required fields: <code>title</code>, <code>price</code>. 
                  Optional: <code>category</code>, <code>style</code>, <code>status</code>, <code>image_url</code>, <code>description</code>, <code>is_featured</code>.
                </p>
                <textarea 
                  rows={10} 
                  className="input-field" 
                  placeholder='[ { "title": "Floral Stencil", "price": 499, "category": "Bridal" } ]'
                  value={bulkJson} 
                  onChange={e => setBulkJson(e.target.value)} 
                />
                <button type="submit" disabled={loading} className="brutalist-button" style={{ marginTop: "1rem" }}>
                  {loading ? "Importing..." : "Run Import"}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}

        {isFormOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} style={{ background: "var(--cl-bg)", color: "var(--cl-text)", width: "100%", maxWidth: "800px", maxHeight: "90vh", overflowY: "auto", border: "var(--border-thick)", boxShadow: "var(--shadow-brutal)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "1.5rem", borderBottom: "var(--border-thick)" }}>
                <h2 style={{ fontSize: "1.5rem" }}>{editingId ? "Edit Product" : "New Product"}</h2>
                <button onClick={resetForm}><X size={24} /></button>
              </div>
              <form onSubmit={handleSubmit} style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                  <div>
                    <label className="input-label">Title</label>
                    <input required className="input-field" value={formData.title} onChange={handleTitleChange} />
                  </div>
                  <div>
                    <label className="input-label">Slug (URL endpoint)</label>
                    <input required className="input-field" placeholder="e.g. elegant-floral" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '')})} />
                  </div>
                  <div>
                    <label className="input-label">Price (₹)</label>
                    <input required type="number" step="0.01" className="input-field" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
                  </div>
                  <div>
                    <label className="input-label">Compare at Price (₹)</label>
                    <input type="number" step="0.01" className="input-field" value={formData.compare_at_price} onChange={e => setFormData({...formData, compare_at_price: e.target.value})} />
                  </div>
                  <div>
                    <label className="input-label">Category</label>
                    <select className="input-field" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                      <option>Bridal</option><option>Festival</option><option>Everyday</option>
                    </select>
                  </div>
                  <div>
                    <label className="input-label">Style</label>
                    <select className="input-field" value={formData.style} onChange={e => setFormData({...formData, style: e.target.value})}>
                      <option>Floral</option><option>Geometric</option><option>Paisley</option><option>Arabic</option>
                    </select>
                  </div>
                  <div>
                    <label className="input-label">Status</label>
                    <select className="input-field" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                      <option>In Stock</option><option>Out of Stock</option><option>Low Stock</option><option>Best Seller</option><option>New</option>
                    </select>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "1.5rem" }}>
                    <input type="checkbox" style={{ width: "1.2rem", height: "1.2rem", accentColor: "var(--cl-primary)" }} checked={formData.is_featured} onChange={e => setFormData({...formData, is_featured: e.target.checked})} />
                    <label className="input-label" style={{ marginBottom: 0 }}>Feature on Homepage</label>
                  </div>
                </div>

                <div>
                  <label className="input-label">Description</label>
                  <textarea rows={4} className="input-field" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                </div>

                <div>
                  <label className="input-label">Product Cover Image</label>
                  <div style={{ display: "flex", gap: "1rem", alignItems: "flex-end" }}>
                    {formData.image_url && (
                      <div style={{ width: "100px", height: "100px", border: "var(--border-thick)", overflow: "hidden" }}>
                        <img src={formData.image_url} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </div>
                    )}
                    <label className="brutalist-button brutalist-button--outline" style={{ cursor: "pointer", padding: "0.8rem 1.5rem" }}>
                      <Upload size={16} /> {loading ? "Uploading..." : "Upload Cover"}
                      <input type="file" accept="image/*" style={{ display: "none" }} onChange={handleFileChange} disabled={loading} />
                    </label>
                  </div>
                </div>

                <div>
                  <label className="input-label">Gallery Images (Slider)</label>
                  <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "1rem" }}>
                    {(formData.gallery_urls || []).map((url, idx) => (
                      <div key={idx} style={{ position: "relative", width: "100px", height: "100px", border: "var(--border-thick)", overflow: "hidden" }}>
                        <img src={url} alt={`Gallery ${idx}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        <button type="button" onClick={() => removeGalleryImage(idx)} style={{ position: "absolute", top: 0, right: 0, background: "var(--cl-danger)", color: "#fff", border: "none", width: "20px", height: "20px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>&times;</button>
                      </div>
                    ))}
                  </div>
                  <label className="brutalist-button brutalist-button--outline" style={{ cursor: "pointer", padding: "0.8rem 1.5rem" }}>
                    <Upload size={16} /> {loading ? "Uploading..." : "Add to Gallery"}
                    <input type="file" accept="image/*" multiple style={{ display: "none" }} onChange={handleGalleryChange} disabled={loading} />
                  </label>
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", marginTop: "1rem", borderTop: "var(--border-thick)", paddingTop: "1.5rem" }}>
                  <button type="button" onClick={resetForm} className="brutalist-button brutalist-button--outline">Cancel</button>
                  <button type="submit" disabled={loading} className="brutalist-button">
                    {loading ? "Saving..." : "Save Product"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem" }}>
        {products.map((product, i) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            style={{ border: "var(--border-thick)", overflow: "hidden", background: "var(--cl-surface)", display: "flex", flexDirection: "column" }}
          >
            <div style={{ height: "180px", background: "var(--cl-secondary)", overflow: "hidden", position: "relative" }}>
              {product.image_url ? (
                <img src={product.image_url} alt={product.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.2 }}>No Image</div>
              )}
            </div>
            <div style={{ padding: "1.25rem", flex: 1, display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                <h3 style={{ fontSize: "1rem", fontWeight: 600, fontFamily: "var(--font-body)" }}>{product.title}</h3>
                <span style={{ fontWeight: 700 }}>₹{product.price}</span>
              </div>
              <div style={{ display: "flex", gap: "0.5rem", fontSize: "0.75rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
                <span style={{ padding: "0.15rem 0.5rem", border: "1.5px solid var(--cl-muted)", textTransform: "uppercase", fontWeight: 600 }}>{product.category}</span>
                <span style={{
                  padding: "0.15rem 0.5rem", textTransform: "uppercase", fontWeight: 600,
                  background: product.status === "In Stock" ? "var(--cl-success)" : product.status === "Old Stock" ? "var(--cl-accent)" : "var(--cl-primary)",
                  color: "var(--cl-bg)",
                }}>{product.status}</span>
                {product.is_featured && <span style={{ padding: "0.15rem 0.5rem", background: "var(--cl-text)", color: "var(--cl-bg)" }}>★ Featured</span>}
              </div>

              <div style={{ borderTop: "1px dashed var(--cl-muted)", paddingTop: "1rem", display: "flex", justifyContent: "space-between", marginTop: "auto" }}>
                <button onClick={() => handleEdit(product)} style={{ fontSize: "0.85rem", textDecoration: "underline", fontWeight: 600 }}>Edit</button>
                <button onClick={() => handleDelete(product.id, product.title)} style={{ fontSize: "0.85rem", color: "var(--cl-danger)", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>
          </motion.div>
        ))}
        {products.length === 0 && (
          <div style={{ padding: "3rem", gridColumn: "1/-1", textAlign: "center", opacity: 0.5 }}>No products found in catalog. Create your first product!</div>
        )}
      </div>
    </div>
  );
}
