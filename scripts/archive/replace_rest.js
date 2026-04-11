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

replaceInFile('app/shop/[slug]/ProductClient.jsx', [
    {
        from: /<img src=\{product\.image_url\}.*?\/>/,
        to: '{product.image_url && <Image src={product.image_url} alt={product.title} fill style={{ objectFit: "cover" }} priority unoptimized /> }'
    },
    {
        from: /<img src=\{url\}.*?\/>/g,
        to: '<Image src={url} alt={Gallery \} fill style={{ objectFit: "cover" }} unoptimized />'
    }
]);

replaceInFile('app/blog/[slug]/BlogDetailClient.jsx', [
    {
        from: /<img src=\{blog\.image_url\}.*?\/>/,
        to: '<Image src={blog.image_url} alt={blog.title} fill style={{ objectFit: "cover" }} priority unoptimized />'
    }
]);

// also add ignore to opengraph-image
if (fs.existsSync('app/shop/[slug]/opengraph-image.jsx')) {
    let p = 'app/shop/[slug]/opengraph-image.jsx';
    let txt = fs.readFileSync(p, 'utf8');
    if(!txt.includes('/* eslint-disable @next/next/no-img-element */')) {
        fs.writeFileSync(p, '/* eslint-disable @next/next/no-img-element */\n' + txt);
        console.log('updated og');
    }
}
if (fs.existsSync('app/opengraph-image.jsx')) {
    let p = 'app/opengraph-image.jsx';
    let txt = fs.readFileSync(p, 'utf8');
    if(!txt.includes('/* eslint-disable @next/next/no-img-element */')) {
        fs.writeFileSync(p, '/* eslint-disable @next/next/no-img-element */\n' + txt);
        console.log('updated top og');
    }
}

console.log('done.');
