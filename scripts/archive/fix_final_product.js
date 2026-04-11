const fs = require('fs');
let file = 'app/shop/[slug]/ProductClient.jsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace('<Image={img} fill unoptimized />', '<Image src={img} alt="Thumbnail view" fill style={{ objectFit: "cover" }} unoptimized />');
fs.writeFileSync(file, content);
console.log('Fixed Image src tag');
