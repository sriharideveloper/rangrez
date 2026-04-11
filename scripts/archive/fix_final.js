const fs = require('fs');
let file = 'app/shop/[slug]/ProductClient.jsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/<img\s*src=\{gallery\[activeImage\]\}\s*alt=\{([^}]+)\}\s*style=\{\{ width: "100%", height: "100%", objectFit: "cover" \}\}\s*\/>/g, 
'<Image src={gallery[activeImage]} alt={} fill style={{ objectFit: "cover" }} priority unoptimized />');

content = content.replace(/<img(.*?)src=\{img\}(.*?)\/>/gs, '<Image={img} fill unoptimized />');

fs.writeFileSync(file, content);
console.log('Fixed ProductClient gallery');
