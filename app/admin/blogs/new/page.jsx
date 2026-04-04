"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, Save, Eye, Layout, Type, Image as ImageIcon, Tag as TagIcon, Sparkles } from "lucide-react";
import { upsertBlog, getBlogBySlug } from "../../../../lib/supabase/blogs";

// Zero-dependency basic markdown renderer for speed and reliability
function simpleMarkdown(text) {
  if (!text) return "";
  let html = text
    .replace(/^# (.*$)/gm, '<h1>$1</h1>')
    .replace(/^## (.*$)/gm, '<h2>$1</h2>')
    .replace(/^### (.*$)/gm, '<h3>$1</h3>')
    .replace(/\*\*(.*)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*)\*/g, '<em>$1</em>')
    .replace(/^\- (.*$)/gm, '<li>$1</li>')
    .replace(/\n\n/g, '<br/><br/>')
    .replace(/\!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" style="max-width:100%; border:var(--border-thin)"/>')
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" style="color:var(--cl-primary)">$1</a>');
  return html;
}

export default function BlogEditor() {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    featured_image: "",
    author: "Rangrez Team",
    tags: []
  });

  useEffect(() => {
    if (id && id !== "new") {
      loadBlog();
    }
  }, [id]);

  async function loadBlog() {
    // Note: If id is a slug in the URL, we'd use getBlogBySlug. 
    // Usually admin uses UUID. For simplicity here:
    const data = await getBlogBySlug(id); 
    if (data) setFormData(data);
  }

  const handleSave = async () => {
    setLoading(true);
    try {
      await upsertBlog(formData);
      router.push("/admin/blogs");
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "1200px" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "3rem" }}>
        <div>
          <Link href="/admin/blogs" style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem", opacity: 0.5, marginBottom: "1rem" }}>
            <ChevronLeft size={16} /> Back to Vault
          </Link>
          <h1 style={{ fontSize: "2.5rem", fontFamily: "var(--font-heading)", textTransform: "uppercase" }}>
            {id === "new" ? "New Story" : "Edit Story"}
          </h1>
        </div>
        <div style={{ display: "flex", gap: "1rem" }}>
          <button 
            onClick={() => setPreview(!preview)} 
            className="brutalist-button" 
            style={{ background: "var(--cl-surface)", color: "var(--cl-text)", padding: "1rem 2rem" }}
          >
            {preview ? <Layout size={18} /> : <Eye size={18} />} {preview ? "Edit Mode" : "Preview"}
          </button>
          <button 
            onClick={handleSave} 
            disabled={loading}
            className="brutalist-button" 
            style={{ padding: "1rem 3rem" }}
          >
            <Save size={18} style={{ marginRight: "8px" }} /> {loading ? "Saving..." : "Publish"}
          </button>
        </div>
      </header>

      {!preview ? (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 350px", gap: "3rem" }}>
          {/* Main Content Area */}
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            <div>
              <label className="input-label"><Type size={14} /> Title</label>
              <input 
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="input-field" 
                placeholder="The Soul of Malabar Henna..." 
                style={{ fontSize: "1.5rem", fontWeight: 700 }}
              />
            </div>

            <div>
              <label className="input-label"><ImageIcon size={14} /> Markdown Content</label>
              <textarea 
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                className="input-field" 
                placeholder="# Start your story with markdown..." 
                style={{ minHeight: "600px", fontFamily: "monospace", fontSize: "1rem", lineHeight: 1.6 }}
              />
            </div>
          </div>

          {/* Sidebar Settings */}
          <aside style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
            <div>
              <label className="input-label">Slug</label>
              <input 
                value={formData.slug}
                onChange={(e) => setFormData({...formData, slug: e.target.value.toLowerCase().replace(/ /g, "-")})}
                className="input-field" 
                placeholder="art-of-henna" 
              />
            </div>

            <div>
              <label className="input-label">Excerpt</label>
              <textarea 
                value={formData.excerpt}
                onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                className="input-field" 
                placeholder="A short punchy summary..." 
                style={{ height: "120px" }}
              />
            </div>

            <div>
              <label className="input-label">Featured Image URL</label>
              <input 
                value={formData.featured_image}
                onChange={(e) => setFormData({...formData, featured_image: e.target.value})}
                className="input-field" 
                placeholder="https://..." 
              />
            </div>

            <div>
              <label className="input-label"><TagIcon size={14} /> Tags (comma separated)</label>
              <input 
                value={formData.tags.join(", ")}
                onChange={(e) => setFormData({...formData, tags: e.target.value.split(",").map(t => t.trim())})}
                className="input-field" 
                placeholder="culture, bridal, kochi" 
              />
            </div>

            <div style={{ padding: "1.5rem", background: "var(--cl-surface)", border: "var(--border-thin)", marginTop: "2rem" }}>
              <p style={{ fontSize: "0.8rem", fontWeight: 800, textTransform: "uppercase", marginBottom: "1rem" }}>Writing Tips</p>
              <ul style={{ fontSize: "0.85rem", opacity: 0.6, paddingLeft: "1rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <li>Use # for large headers</li>
                <li>Use **bold** for emphasis</li>
                <li>Keep slugs short and clean</li>
              </ul>
            </div>
          </aside>
        </div>
      ) : (
        /* Preview Mode */
        <div style={{ maxWidth: "800px", margin: "0 auto", background: "var(--cl-bg)", border: "var(--border-thick)", padding: "4rem" }}>
           <p style={{ color: "var(--cl-primary)", fontWeight: 800, textTransform: "uppercase", fontSize: "0.8rem", marginBottom: "1rem" }}>
              {formData.tags.join(" • ") || "DRAFT"}
           </p>
           <h1 style={{ fontSize: "4rem", fontFamily: "var(--font-heading)", lineHeight: 1, marginBottom: "2rem" }}>{formData.title || "Untitled Preview"}</h1>
           <div 
             className="markdown-content" 
             dangerouslySetInnerHTML={{ __html: simpleMarkdown(formData.content) }} 
             style={{ lineHeight: 1.8, fontSize: "1.1rem" }}
           />
        </div>
      )}
    </div>
  );
}
