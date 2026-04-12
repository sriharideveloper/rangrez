const fs = require('fs');
let file = 'app/layout.jsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/https:\/\/rangrez-henna\.com/g, 'https://www.rangrezstencils.in');

const metaIndex = content.indexOf('export const metadata = {');
if (metaIndex !== -1 && !content.includes('metadataBase: new URL')) {
    content = content.replace('export const metadata = {', 'export const metadata = {\n  metadataBase: new URL("https://www.rangrezstencils.in"),\n  icons: {\n    icon: "/logo.jpg",\n    apple: "/logo.jpg"\n  },');
}

fs.writeFileSync(file, content);
