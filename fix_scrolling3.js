const fs = require('fs');

const p = 'app/admin/products/AdminProductsClient.jsx';
let c = fs.readFileSync(p, 'utf8');

c = c.replace(/<motion\.div onClick=\{e => e\.stopPropagation\(\)\} initial=\{\{ scale: 0\.9 \}\} animate=\{\{ scale: 1 \}\} style=\{\{ background/g, '<motion.div data-lenis-prevent="true" onClick={e => e.stopPropagation()} initial={{ scale: 0.9 }} animate={{ scale: 1 }} style={{ background');
fs.writeFileSync(p, c);
console.log('Fixed', p);

const p2 = 'app/admin/coupons/AdminCouponsClient.jsx';
if (fs.existsSync(p2)) {
  let c2 = fs.readFileSync(p2, 'utf8');
  c2 = c2.replace(/<motion\.div onClick=\{e => e\.stopPropagation\(\)\} initial=\{\{ scale: 0\.9 \}\} animate=\{\{ scale: 1 \}\} style=\{\{ background/g, '<motion.div data-lenis-prevent="true" onClick={e => e.stopPropagation()} initial={{ scale: 0.9 }} animate={{ scale: 1 }} style={{ background');
  fs.writeFileSync(p2, c2);
  console.log('Fixed', p2);
}

const p3 = 'app/admin/orders/AdminOrdersClient.jsx';
if (fs.existsSync(p3)) {
  let c3 = fs.readFileSync(p3, 'utf8');
  c3 = c3.replace(/<motion\.div onClick=\{e => e\.stopPropagation\(\)\} initial=\{\{ scale: 0\.9 \}\} animate=\{\{ scale: 1 \}\} style=\{\{ background/g, '<motion.div data-lenis-prevent="true" onClick={e => e.stopPropagation()} initial={{ scale: 0.9 }} animate={{ scale: 1 }} style={{ background');
  fs.writeFileSync(p3, c3);
  console.log('Fixed', p3);
}

const p4 = 'app/admin/messages/AdminMessagesClient.jsx';
if (fs.existsSync(p4)) {
  let c4 = fs.readFileSync(p4, 'utf8');
  c4 = c4.replace(/<motion\.div onClick=\{e => e\.stopPropagation\(\)\} initial=\{\{ scale: 0\.9 \}\} animate=\{\{ scale: 1 \}\} style=\{\{ background/g, '<motion.div data-lenis-prevent="true" onClick={e => e.stopPropagation()} initial={{ scale: 0.9 }} animate={{ scale: 1 }} style={{ background');
  fs.writeFileSync(p4, c4);
  console.log('Fixed', p4);
}
