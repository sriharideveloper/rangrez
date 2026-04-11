const fs = require('fs');

function replaceInFile(filePath, replacements) {
    if (!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    // Add import if missing
    if (!content.includes('import Image from "next/image"') && !content.includes('import Image from \'next/image\'')) {
        content = 'import Image from "next/image";\n' + content;
    }
    
    replacements.forEach(r => {
        content = content.replace(r.from, r.to);
    });
    
    if (content !== original) {
        fs.writeFileSync(filePath, content);
        console.log('Updated ' + filePath);
    }
}

replaceInFile('app/page.jsx', [
    {
        from: /<img src=\{t\.avatar_url\}.*?\/>/,
        to: '<Image src={t.avatar_url} alt={t.name || "Avatar"} width={32} height={32} style={{ borderRadius: "50%", objectFit: "cover" }} unoptimized />'
    }
]);

replaceInFile('app/about/page.js', [
    {
        from: /<img[\s\n]*src="https:\/\/images\.unsplash\.com\/photo-1555169062-013468b47731\?auto=format&fit=crop&q=80&w=1600"[\s\n]*alt="Henna Process"[\s\n]*style=\{\{\s*width:\s*"100%",\s*height:\s*"100%",\s*objectFit:\s*"cover",\s*opacity:\s*0\.5,\s*mixBlendMode:\s*"multiply"\s*\}\}[\s\n]*\/>/,
        to: '<Image src="https://images.unsplash.com/photo-1555169062-013468b47731?auto=format&fit=crop&q=80&w=1600" alt="Henna Process" fill style={{ objectFit: "cover", opacity: 0.5, mixBlendMode: "multiply" }} unoptimized />'
    }
]);

replaceInFile('app/admin/products/AdminProductsClient.jsx', [
    {
        from: /<img src=\{formData\.image_url\}.*?\/>/g,
        to: '<Image src={formData.image_url} alt="Preview" fill style={{ objectFit: "cover" }} unoptimized />'
    },
    {
        from: /<img src=\{url\}.*?\/>/g,
        to: '<Image src={url} alt={Gallery \} fill style={{ objectFit: "cover" }} unoptimized />'
    },
    {
        from: /<img src=\{product\.image_url\}.*?\/>/g,
        to: '<Image src={product.image_url} alt={product.title || "Product"} fill style={{ objectFit: "cover" }} unoptimized />'
    }
]);

replaceInFile('app/shop/page.js', [
    {
        from: /<img src=\{p\.image_url\}.*?\/>/g,
        to: '{p.image_url && <Image src={p.image_url} alt={p.title || "Product Image"} fill style={{ objectFit: "cover" }} sizes="(max-width: 768px) 100vw, 33vw" unoptimized />}'
    }
]);

replaceInFile('components/CartDrawer.jsx', [
    {
        from: /<img src=\{item\.image\}.*?\/>/g,
        to: '<Image src={item.image} alt={item.title || "Cart item"} width={72} height={72} style={{ objectFit: "cover" }} unoptimized />'
    }
]);

// also we have two from admin blogs
replaceInFile('app/admin/blogs/new/page.jsx', [
    {
        from: /<img src=\{\(formData\.content\|\|''\)\.match\(\/src="([^"]+)"\/\).*?\[0\]\} style=\{\{ width: "100%", height: "100%", objectFit: "cover" \}\} \/>/,
        to: '{ (formData.content||"").match(/src="([^"]+)"/) && <Image src={(formData.content||"").match(/src="([^"]+)"/)[1]} alt="Preview" fill style={{ objectFit: "cover" }} unoptimized /> }'
    }
]);

console.log('Script completed.');
