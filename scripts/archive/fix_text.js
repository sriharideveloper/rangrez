const fs = require('fs');
let file = 'app/shop/[slug]/ProductClient.jsx';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(/fontSize: "0.85rem", padding: "0 1rem"/g, 'fontSize: "0.75rem", padding: "0 1rem"');
fs.writeFileSync(file, content);
