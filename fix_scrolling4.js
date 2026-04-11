const fs = require('fs');

const p = 'app/shop/[slug]/ProductClient.jsx';
if (fs.existsSync(p)) {
  let c = fs.readFileSync(p, 'utf8');
  c = c.replace(/<div style=\{\{ maxHeight: "600px", overflowY: "auto",/g, '<div data-lenis-prevent="true" style={{ maxHeight: "600px", overflowY: "auto",');
  fs.writeFileSync(p, c);
  console.log('Fixed', p);
}

const p2 = 'components/CartDrawer.jsx';
if (fs.existsSync(p2)) {
  let c2 = fs.readFileSync(p2, 'utf8');
  c2 = c2.replace(/<div style=\{\{ flex: 1, overflowY: "auto",/g, '<div data-lenis-prevent="true" style={{ flex: 1, overflowY: "auto",');
  fs.writeFileSync(p2, c2);
  console.log('Fixed', p2);
}

// Sidebars
const p3 = 'app/admin/layout.js';
if (fs.existsSync(p3)) {
  let c3 = fs.readFileSync(p3, 'utf8');
  if(!c3.includes('data-lenis-prevent')) {
     c3 = c3.replace('<nav className="admin-sidebar-nav">', '<nav className="admin-sidebar-nav" data-lenis-prevent="true">');
     fs.writeFileSync(p3, c3);
     console.log('Fixed', p3);
  }
}
