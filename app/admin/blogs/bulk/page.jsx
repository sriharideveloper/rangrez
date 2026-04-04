"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, Database, CheckCircle2, AlertCircle } from "lucide-react";
import { bulkInsertBlogs } from "../../../../lib/supabase/blogs";

export default function BulkBlogUpload() {
  const [jsonInput, setJsonInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleBulkUpload = async () => {
    setLoading(true);
    setResult(null);
    try {
      const blogs = JSON.parse(jsonInput);
      if (!Array.isArray(blogs)) throw new Error("JSON must be an array of blog objects.");
      
      const data = await bulkInsertBlogs(blogs);
      setResult({ success: true, count: data.length });
      setJsonInput("");
    } catch (err) {
      setResult({ success: false, message: err.message });
    } finally {
      setLoading(false);
    }
  };

  const exampleJson = `[
  {
    "title": "The Art of Henna",
    "slug": "art-of-henna",
    "content": "# Markdown Content Here...",
    "excerpt": "A brief overview of henna...",
    "author": "Rangrez Team",
    "tags": ["culture", "diy"]
  }
]`;

  return (
    <div style={{ maxWidth: "1000px" }}>
      <header style={{ marginBottom: "3rem" }}>
        <Link href="/admin/blogs" style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem", opacity: 0.5, marginBottom: "1.5rem" }}>
          <ChevronLeft size={16} /> Back to Blogs
        </Link>
        <h1 style={{ fontSize: "2.5rem", fontFamily: "var(--font-heading)", textTransform: "uppercase" }}>Bulk Migration</h1>
        <p style={{ opacity: 0.6 }}>Paste your JSON data to rapidly populate the blog vault.</p>
      </header>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 350px", gap: "3rem" }}>
        <div>
          <label className="input-label">JSON Input</label>
          <textarea 
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            placeholder="Paste your JSON array here..."
            className="input-field"
            style={{ height: "500px", fontFamily: "monospace", fontSize: "0.9rem", resize: "none" }}
          />
          
          <button 
            onClick={handleBulkUpload}
            disabled={loading || !jsonInput}
            className="brutalist-button" 
            style={{ marginTop: "2rem", width: "100%", padding: "1.2rem", fontSize: "1rem" }}
          >
            {loading ? "Processing..." : "Execute Bulk Upload"}
          </button>

          {result && (
            <div style={{ 
              marginTop: "2rem", padding: "1.5rem", 
              border: "var(--border-thick)", 
              background: result.success ? "rgba(39,174,96,0.1)" : "rgba(192,57,43,0.1)",
              display: "flex", alignItems: "center", gap: "1rem"
            }}>
              {result.success ? <CheckCircle2 color="var(--cl-success)" /> : <AlertCircle color="var(--cl-danger)" />}
              <div>
                <p style={{ fontWeight: 800 }}>{result.success ? "Success!" : "Upload Failed"}</p>
                <p style={{ fontSize: "0.9rem", opacity: 0.7 }}>
                  {result.success ? `Successfully imported ${result.count} blog posts.` : result.message}
                </p>
              </div>
            </div>
          )}
        </div>

        <aside>
          <div style={{ padding: "2rem", background: "var(--cl-surface)", border: "var(--border-thin)" }}>
            <h4 style={{ fontWeight: 800, textTransform: "uppercase", fontSize: "0.8rem", letterSpacing: "0.1em", marginBottom: "1.5rem" }}>
              Expected Schema
            </h4>
            <pre style={{ fontSize: "0.75rem", opacity: 0.6, overflowX: "auto" }}>{exampleJson}</pre>
            <ul style={{ fontSize: "0.85rem", marginTop: "2rem", paddingLeft: "1.2rem", opacity: 0.7, display: "flex", flexDirection: "column", gap: "1rem" }}>
              <li><strong>title</strong> (required)</li>
              <li><strong>slug</strong> (required, unique)</li>
              <li><strong>content</strong> (markdown string)</li>
              <li><strong>author</strong> (optional)</li>
              <li><strong>tags</strong> (array of strings)</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
