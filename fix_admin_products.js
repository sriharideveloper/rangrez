const fs = require('fs');
let code = fs.readFileSync('app/admin/products/AdminProductsClient.jsx', 'utf8');

// Remove category and status from initial states
code = code.replace(
  'const [newProduct, setNewProduct] = useState({\n    title: "",\n    description: "",\n    price: "",\n    compare_at_price: "",\n    category: "Bridal",\n    status: "In Stock",\n    size: "Bridal",\n    stock: "0",\n    is_active: true,\n    is_featured: false,\n  });',
  'const [newProduct, setNewProduct] = useState({\n    title: "",\n    description: "",\n    price: "",\n    compare_at_price: "",\n    size: "Bridal",\n    stock: "0",\n    is_active: true,\n    is_featured: false,\n  });'
);

code = code.replace(
  'const [editingProduct, setEditingProduct] = useState(null); // { id, title, price, category, status, ... }',
  'const [editingProduct, setEditingProduct] = useState(null);'
);

// Bulk JSON parse fix - removing status & category overrides
code = code.replace(
  /parsed\s*=\s*parsed\.map\(\s*\(p\)\s*=>\s*\({\s*\.\.\.p,\s*status:\s*p\.status\s*\|\|\s*"In Stock",\s*is_active:\s*p\.is_active\s*!==\s*undefined\s*\?\s*p\.is_active\s*:\s*true,\s*is_featured:\s*p\.is_featured\s*!==\s*undefined\s*\?\s*p\.is_featured\s*:\s*false,\s*}\)\s*\);/,
  'parsed = parsed.map(p => ({\n        ...p,\n        is_active: p.is_active !== undefined ? p.is_active : true,\n        is_featured: p.is_featured !== undefined ? p.is_featured : false\n      }));'
);

// Table headers - remove category & Status
code = code.replace(
  /<div style=\{\{\s*display:\s*'grid',\s*gridTemplateColumns:\s*"(?:2fr|3fr|1fr)[^"]*",\s*gap:\s*'1rem',\s*padding:\s*'1rem',\s*borderBottom:\s*'var\(--border-thin\)',\s*background:\s*'var\(--cl-surface\)'\s*\}\}>\s*<div.*?>Product<\/div>\s*<div.*?>Category<\/div>\s*<div.*?>Price<\/div>\s*<div.*?>Status<\/div>\s*<div.*?>Actions<\/div>\s*<\/div>/g,
  '<div style={{ display: "grid", gridTemplateColumns: "3fr 1fr 1fr 1fr 1fr", gap: "1rem", padding: "1rem", borderBottom: "var(--border-thin)", background: "var(--cl-surface)", fontWeight: 700, textTransform: "uppercase", fontSize: "0.85rem" }}>\n  <div>Product</div>\n  <div>Size / Variants</div>\n  <div>Stock</div>\n  <div>Price</div>\n  <div>Actions</div>\n</div>'
);

fs.writeFileSync('app/admin/products/AdminProductsClient.jsx', code);
