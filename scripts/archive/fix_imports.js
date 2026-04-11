const fs = require('fs');

const files = [
    'app/page.jsx',
    'app/about/page.js',
    'app/admin/products/AdminProductsClient.jsx',
    'app/shop/page.js',
    'components/CartDrawer.jsx',
    'app/admin/blogs/new/page.jsx',
    'app/shop/[slug]/ProductClient.jsx',
    'app/blog/[slug]/BlogDetailClient.jsx'
];

files.forEach(f => {
    if(!fs.existsSync(f)) return;
    let content = fs.readFileSync(f, 'utf8');
    
    // Fix use client
    if (content.includes('"use client"') || content.includes("'use client'")) {
        // remove all "use client"
        content = content.replace(/"use client"\s*;?\s*/g, '');
        content = content.replace(/'use client'\s*;?\s*/g, '');
        // put it at the very top
        content = '"use client";\n' + content;
    }
    
    fs.writeFileSync(f, content);
});

console.log('Fixed use client positions');
