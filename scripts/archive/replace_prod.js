const fs = require('fs');

let file = 'app/shop/[slug]/ProductClient.jsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('import Image from "next/image"')) {
    content = 'import Image from "next/image";\n' + content;
}

content = content.replace(/<img(.*?)src=\{product\.image_url\}(.*?)\/>/g, '<Image={product.image_url} fill unoptimized />');
content = content.replace(/<img(.*?)src=\{img\}(.*?)\/>/g, '<Image={img} fill unoptimized />');
content = content.replace(/<img(.*?)src=\{p\.image_url\}(.*?)\/>/g, '{p.image_url && <Image={p.image_url} fill unoptimized />}');

fs.writeFileSync(file, content);
console.log('Fixed ProductClient.jsx');

file = 'app/admin/blogs/new/page.jsx';
content = fs.readFileSync(file, 'utf8');
if (!content.includes('import Image from "next/image"')) {
    content = 'import Image from "next/image";\n' + content;
}
content = content.replace(/<img src=\{formData\.featured_image\}(.*?)\/>/g, '{formData.featured_image && <Image src={formData.featured_image} fill unoptimized /> }');
fs.writeFileSync(file, content);
console.log('Fixed Admin blogs.');
