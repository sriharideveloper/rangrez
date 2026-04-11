const fs = require('fs');
let files = ['app/blog/[slug]/opengraph-image.jsx', 'app/shop/[slug]/opengraph-image.jsx'];
files.forEach(f => {
   let content = fs.readFileSync(f, 'utf8');
   content = content.replace(/https:\/\/rangrez-henna\.com/g, 'https://www.rangrezstencils.in');
   fs.writeFileSync(f, content);
});
