const fs = require('fs');
const glob = require('fs').promises.readdir; // no, let's use simple find
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      if(!file.includes('node_modules') && !file.includes('.next')) {
        results = results.concat(walk(file));
      }
    } else {
      if (file.endsWith('.jsx') || file.endsWith('.js')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk('.');
files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  let original = content;

  // Add data-lenis-prevent to elements with overflowY
  
  if (content.includes('overflowY: "auto"')) {
    // Specifically looking for motion.div or div that has style={{ ... overflowY: "auto" ... }}
    // The easiest way is to inject data-lenis-prevent right before style={{
    content = content.replace(/<motion\.div([^>]*)style=\{\{([^}]*overflowY:\s*"auto"[^}]*)\}\}/g, '<motion.div data-lenis-prevent="true"  style={{}}');
    content = content.replace(/<div([^>]*)style=\{\{([^}]*overflowY:\s*"auto"[^}]*)\}\}/g, '<div data-lenis-prevent="true"  style={{}}');
  }

  // Also in layout.js for the admin sidebar:
  if (f.includes('layout.js') || f.includes('layout.jsx')) {
      content = content.replace('<nav className="admin-sidebar-nav">', '<nav className="admin-sidebar-nav" data-lenis-prevent="true">');
  }

  if (content !== original) {
    fs.writeFileSync(f, content);
    console.log('Fixed', f);
  }
});
