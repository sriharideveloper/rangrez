const fs = require('fs');
let file = 'app/shop/[slug]/ProductClient.jsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace('<Image={p.image_url} fill unoptimized />', '<Image src={p.image_url} alt={p.title} fill style={{ objectFit: "cover" }} unoptimized />');
fs.writeFileSync(file, content);
console.log('Fixed Image src tag');
