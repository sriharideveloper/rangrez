const fs = require('fs');
let code = fs.readFileSync('app/admin/products/AdminProductsClient.jsx', 'utf8');

// Remove category wrapper block
code = code.replace(
  /<div>\s*<label className="input-label">Category<\/label>\s*<select className="input-field"[^>]*>\s*<option>Bridal<\/option><option>Festival<\/option><option>Everyday<\/option>\s*<\/select>\s*<\/div>/g,
  ''
);

// Remove status block
code = code.replace(
  /<div>\s*<label className="input-label">Status<\/label>\s*<select className="input-field"[^>]*>\s*<option>In Stock<\/option><option>Out of Stock<\/option>\s*<\/select>\s*<\/div>/g,
  ''
);

// Table row mappings - removing category & status displays
code = code.replace(
  /<div>\{p\.category\}<\/div>\s*<div>â‚¹\{p\.price\}<\/div>\s*<div>\s*<span[^>]*>\{p\.status\}<\/span>\s*<\/div>/g,
  '<div>{p.size || "Default"}</div>\n                  <div>{p.stock} units</div>\n                  <div>₹{p.price}</div>'
);

fs.writeFileSync('app/admin/products/AdminProductsClient.jsx', code);
