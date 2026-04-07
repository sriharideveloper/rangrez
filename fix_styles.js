const fs = require('fs');
const files = [
  'app/admin/products/AdminProductsClient.jsx',
  'app/admin/coupons/AdminCouponsClient.jsx',
  'app/admin/orders/AdminOrdersClient.jsx',
  'app/admin/users/AdminUsersClient.jsx'
];

for(let pg of files) {
  if(fs.existsSync(pg)) {
    let c = fs.readFileSync(pg, 'utf8');
    // Regex to fix multiple styles in a row on brutalist button
    // It captures all the style tags, and we can just replace them.
    // Given the specific errors, let's just strip 'em all out first and give them one correct style.
    
    // First, let's just remove all the injected styles from the previous script:
    c = c.replace(/ style=\{\{ padding: '0\.8rem 1\.2rem', fontSize: '0\.85rem' \}\}/g, '');
    
    fs.writeFileSync(pg, c);
  }
}
console.log('Fixed styling');
