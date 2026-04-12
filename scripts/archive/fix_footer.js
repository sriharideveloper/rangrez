const fs = require('fs');
let file = 'components/Footer.jsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace('RANGREZ\\n            </h3>', '<img src="/logo.jpg" alt="Rangrez Logo" style={{ height: "60px" }} />\\n            </h3>');

fs.writeFileSync(file, content);
