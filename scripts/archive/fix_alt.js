const fs = require('fs');
let file = 'app/shop/[slug]/ProductClient.jsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace('alt={} fill', 'alt={product.title} fill');
fs.writeFileSync(file, content);
console.log('Fixed alt tag');
