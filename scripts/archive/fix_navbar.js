const fs = require('fs');
let file = 'components/Navbar.jsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace('<span className="brand-text">RANGREZ</span>', '<img src="/logo.jpg" alt="Rangrez Logo" style={{ height: "40px" }} />');
content = content.replace('<span className="brand-text">RANGREZ</span>', '<img src="/logo.jpg" alt="Rangrez Logo" style={{ height: "40px" }} />');

fs.writeFileSync(file, content);
