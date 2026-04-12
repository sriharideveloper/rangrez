const fs = require('fs');
let file = 'app/admin/shipping/page.js';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(/name: ".*?",/g, '');
fs.writeFileSync(file, content);
