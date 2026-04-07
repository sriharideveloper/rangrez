const fs = require('fs');

const pages = [
  { p: 'app/admin/products/AdminProductsClient.jsx', vn: 'products', fn: 'rangrez-products' },
  { p: 'app/admin/coupons/AdminCouponsClient.jsx', vn: 'coupons', fn: 'rangrez-coupons' },
  { p: 'app/admin/orders/AdminOrdersClient.jsx', vn: 'orders', fn: 'rangrez-orders' },
  { p: 'app/admin/users/AdminUsersClient.jsx', vn: 'users', fn: 'rangrez-users' }
];

pages.forEach(pg => {
  if (fs.existsSync(pg.p)) {
    let c = fs.readFileSync(pg.p, 'utf8');
    if (!c.includes('AdminExport')) {
      c = c.replace('import { useState }', 'import { useState } from "react";\nimport AdminExport from "../../../components/AdminExport";');
      c = c.replace('<div style={{ display: "flex", gap: "1rem" }}>', '<div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>\n          <AdminExport data={' + pg.vn + '} filename="' + pg.fn + '" />');
      fs.writeFileSync(pg.p, c);
      console.log('Added export to ' + pg.p);
    }
  }
});
