const fs = require('fs');
const files = [
  {p: 'app/admin/products/AdminProductsClient.jsx', v: 'products'},
  {p: 'app/admin/coupons/AdminCouponsClient.jsx', v: 'coupons'},
  {p: 'app/admin/orders/AdminOrdersClient.jsx', v: 'orders'},
  {p: 'app/admin/users/AdminUsersClient.jsx', v: 'users'}
];

for(let f of files) {
  if(fs.existsSync(f.p)) {
    let c = fs.readFileSync(f.p, 'utf8');
    c = c.replace(/className=\"brutalist-button\"/g, "className=\"brutalist-button\" style={{ padding: '0.8rem 1.2rem', fontSize: '0.85rem' }}");
    fs.writeFileSync(f.p, c);
  }
}
"print('done')"
