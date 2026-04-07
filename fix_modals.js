const fs = require('fs');
const glob = require('fs').readdirSync('app/admin', { recursive: true }).filter(f=>f.endsWith('.jsx')).map(f => 'app/admin/'+f);

glob.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let oldContent = content;

  // Add click to outside:
  // Find background: "rgba(0,0,0,0.8)" or rgba(0,0,0,0.8) and attach onClick
  content = content.replace(/padding:\s*"2rem"\s*\}\}>(\s*)<motion\.div\s*initial=\{\{\s*scale:\s*0\.9\s*\}\}\s*animate=\{\{\s*scale:\s*1\s*\}\}\s*style=\{\{/g, 
    'padding: "1rem" }} onClick={(e) => { if(e.target===e.currentTarget) { try{ if(typeof setIsFormOpen!=="undefined")setIsFormOpen(false); if(typeof setIsBulkOpen!=="undefined")setIsBulkOpen(false); if(typeof setViewDetailsOpen!=="undefined")setViewDetailsOpen(false); if(typeof setIsEditOpen!=="undefined")setIsEditOpen(false); if(typeof setIsSettingsOpen!=="undefined")setIsSettingsOpen(false); }catch(e){} } }}><motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} style={{'
  );

  // Stop propagation on inner box, and add maxHeight + overflow
  content = content.replace(/<motion\.div\s*initial=\{\{\s*scale:\s*0\.9\s*\}\}\s*animate=\{\{\s*scale:\s*1\s*\}\}\s*style=\{\{\s*background:\s*"var\(--cl-bg\)",\s*color:\s*"var\(--cl-text\)",\s*width:\s*"100%",\s*maxWidth:\s*"([^"]+)",/g, 
    '<motion.div onClick={e => e.stopPropagation()} initial={{ scale: 0.9 }} animate={{ scale: 1 }} style={{ background: "var(--cl-bg)", color: "var(--cl-text)", width: "100%", maxWidth: "", maxHeight: "90vh", overflowY: "auto", overflowX: "hidden", display: "flex", flexDirection: "column",'
  );

  if (content !== oldContent) {
    fs.writeFileSync(file, content);
    console.log("Fixed modals in " + file);
  }
});
