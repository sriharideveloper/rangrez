const fs = require('fs');
let code = fs.readFileSync('app/shop/page.js', 'utf8');

// Inject searchQuery
code = code.replace(
  'const [sortBy, setSortBy] = useState("featured");',
  'const [sortBy, setSortBy] = useState("featured");\n  const [searchQuery, setSearchQuery] = useState("");'
);

// Replace filteredProducts useMemo
code = code.replace(
  /const filteredProducts = useMemo\(\(\) => \{[\s\S]*?return result;\n  \}, \[filter, sortBy, products\]\);/,
  'const filteredProducts = useMemo(() => {\n    let result = products;\n\n    if (searchQuery.trim() !== "") {\n      const q = searchQuery.toLowerCase();\n      result = result.filter(p => \n        p.title?.toLowerCase().includes(q) ||\n        p.description?.toLowerCase().includes(q) ||\n        p.price?.toString().includes(q)\n      );\n    }\n\n    if (filter !== "all") {\n      result = result.filter(p => p.size === filter);\n    }\n    \n    switch (sortBy) {\n      case "price-asc": result.sort((a, b) => a.price - b.price); break;\n      case "price-desc": result.sort((a, b) => b.price - a.price); break;\n      case "new": result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)); break;\n      default: result.sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0)); break;\n    }\n    return result;\n  }, [filter, sortBy, products, searchQuery]);'
);

// Replace status logic in JSX
code = code.replace(
  /\{p\.status !== "In Stock" && \(\s*<span style=\{\{ position: "absolute"[^>]*>\s*\{p\.status\}\s*<\/span>\s*\)\}/,
  '{p.stock <= 0 && (\n                            <span style={{ position: "absolute", top: "1rem", right: "1rem", background: "var(--cl-primary)", color: "var(--cl-bg)", padding: "0.3rem 0.8rem", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", zIndex: 2 }}>\n                              Out of Stock\n                            </span>\n                          )}'
);

// Replace category text
code = code.replace(
  /\{p\.category\}\s*<\/span>/,
  '{p.size}</span>'
);

// Inject search bar in toolbar
code = code.replace(
  '<span style={{ fontSize: "0.85rem", fontWeight: 600, textTransform: "uppercase" }}>{filteredProducts.length} Products</span>',
  '<input \n              type="text"\n              placeholder="Search products..."\n              value={searchQuery}\n              onChange={(e) => setSearchQuery(e.target.value)}\n              style={{\n                padding: "0.5rem 1rem", border: "var(--border-thick)", background: "transparent", \n                color: "var(--cl-text)", outline: "none", width: "100%", maxWidth: "300px",\n                fontSize: "0.85rem", textTransform: "uppercase"\n              }}\n            />\n            <span style={{ fontSize: "0.85rem", fontWeight: 600, textTransform: "uppercase" }}>{filteredProducts.length} Products</span>'
);

// Fix clear filters 
code = code.replace(
  'onClick={() => { setFilter("all"); setSortBy("featured"); }}',
  'onClick={() => { setFilter("all"); setSortBy("featured"); setSearchQuery(""); }}'
);

fs.writeFileSync('app/shop/page.js', code);
