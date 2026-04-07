const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.jsx')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk('app/admin');
files.forEach(f => {
  let code = fs.readFileSync(f, 'utf8');

  let oldCode = code;

  // 1. Add compact scrollable properties on the inner box and the backdrop close
  code = code.replace(/padding:\s*"2rem"\s*\}\}>(\s*)<motion\.div/g, 
    'padding: "1rem" }} onClick={(e) => { if(e.target===e.currentTarget) { try{ if(typeof setIsFormOpen!=="undefined")setIsFormOpen(false); if(typeof setIsBulkOpen!=="undefined")setIsBulkOpen(false); if(typeof setViewDetailsOpen!=="undefined")setViewDetailsOpen(false); if(typeof setIsEditOpen!=="undefined")setIsEditOpen(false); }catch(e){} } }}><motion.div onClick={e => e.stopPropagation()}'
  );

  // 2. Add maxHeight and overflowY auto to inner boxes
  code = code.replace(/maxWidth:\s*"([^"]+)",/g, 'maxWidth: "", maxHeight: "90vh", overflowY: "auto", overflowX: "hidden", display: "flex", flexDirection: "column",');

  if (oldCode !== code) {
    fs.writeFileSync(f, code);
    console.log("Updated " + f);
  }
});
