"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Edit, Trash2, Search, ExternalLink, Database } from "lucide-react";
import { getAllBlogs, deleteBlog } from "../../../lib/supabase/blogs";

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadBlogs();
  }, []);

  async function loadBlogs() {
    setLoading(true);
    const data = await getAllBlogs();
    setBlogs(data);
    setLoading(false);
  }

  async function handleDelete(id) {
    if (!confirm("Are you sure you want to delete this post?")) return;
    try {
      await deleteBlog(id);
      setBlogs(blogs.filter(b => b.id !== id));
    } catch (err) {
      alert("Error deleting blog: " + err.message);
    }
  }

  const filteredBlogs = blogs.filter(b => 
    b.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    b.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-blogs-container">
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "3rem" }}>
        <div>
          <h1 style={{ fontSize: "2.5rem", fontFamily: "var(--font-heading)", textTransform: "uppercase" }}>Blog Management</h1>
          <p style={{ opacity: 0.6, marginTop: "0.5rem" }}>Curate the Malabar Magic stories.</p>
        </div>
        <div style={{ display: "flex", gap: "1rem" }}>
          <Link href="/admin/blogs/bulk" className="brutalist-button brutalist-button--sm" style={{ background: "var(--cl-surface)", color: "var(--cl-text)", padding: "1rem 2rem", fontSize: "0.9rem" }}>
            <Database size={18} style={{ marginRight: "8px" }} /> Bulk Upload
          </Link>
          <Link href="/admin/blogs/new" className="brutalist-button brutalist-button--sm" style={{ padding: "1rem 2.5rem", fontSize: "0.9rem" }}>
            <Plus size={18} style={{ marginRight: "8px" }} /> Create New Post
          </Link>
        </div>
      </header>

      <div style={{ marginBottom: "2rem", position: "relative" }}>
        <Search style={{ position: "absolute", left: "1.2rem", top: "50%", transform: "translateY(-50%)", opacity: 0.4 }} size={18} />
        <input 
          type="text" 
          placeholder="Search by title or slug..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input-field" 
          style={{ paddingLeft: "3.5rem", width: "100%", maxWidth: "500px" }} 
        />
      </div>

      <div className="admin-data-container">
        <div className="admin-data-grid-4" style={{ padding: "1rem 1.5rem", background: "var(--cl-text)", color: "var(--cl-bg)", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>
          <span>Post Title</span><span>Slug</span><span>Published</span><span>Actions</span>
        </div>
        
        {loading ? (
          <div style={{ padding: "4rem", textAlign: "center" }}>
            <div className="pulse" style={{ width: "40px", height: "40px", background: "var(--cl-primary)", margin: "0 auto" }} />
            <p style={{ marginTop: "1rem", opacity: 0.5 }}>Fetching stories...</p>
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div style={{ padding: "4rem", textAlign: "center", opacity: 0.5 }}>
            No blogs found. Start your first story!
          </div>
        ) : (
          filteredBlogs.map((blog, i) => (
            <div className="admin-data-grid-4" key={blog.id} style={{ padding: "1.25rem 1.5rem", borderTop: i > 0 ? "1px solid var(--cl-muted)" : "none", alignItems: "center" }}>
              <div>
                <p style={{ fontWeight: 700, fontSize: "1.1rem" }}>{blog.title}</p>
                <p style={{ fontSize: "0.7rem", opacity: 0.5, textTransform: "uppercase" }}>{blog.author || "Rangrez Team"}</p>
              </div>
              <code style={{ fontSize: "0.8rem", background: "var(--cl-surface)", padding: "0.2rem 0.5rem" }}>/{blog.slug}</code>
              <span style={{ fontSize: "0.85rem", opacity: 0.7 }}>
                {new Date(blog.published_at).toLocaleDateString()}
              </span>
              <div style={{ display: "flex", gap: "1rem" }}>
                <Link href={`/admin/blogs/${blog.id}`} style={{ color: "var(--cl-text)" }}><Edit size={20} /></Link>
                <Link href={`/blog/${blog.slug}`} target="_blank" style={{ color: "var(--cl-text)" }}><ExternalLink size={20} /></Link>
                <button onClick={() => handleDelete(blog.id)} style={{ color: "var(--cl-danger)" }}><Trash2 size={20} /></button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

