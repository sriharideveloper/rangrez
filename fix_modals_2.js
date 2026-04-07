const fs = require('fs');
const glob = require('fs').readdirSync('app/admin', { recursive: true }).filter(f=>f.endsWith('.jsx')).map(f => 'app/admin/'+f);

glob.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let oldContent = content;

  // Add click to outside:
  // Find background: "rgba(0,0,0,0.8)" and padding: "2rem"
  // Careful to not mess up $1 replacements by making sure the regex is solid
  content = content.replace(/(<motion\.div[^>]*?background:\s*"rgba\(0,0,0,0\.8\)",[^>]*?padding:\s*")2rem("[\s\S]*?>)(\s*)<motion\.div/g, 
    '" }} onClick={(e) => { if(e.target===e.currentTarget) { try{ if(typeof setIsFormOpen!=="undefined")setIsFormOpen(false); if(typeof setIsBulkOpen!=="undefined")setIsBulkOpen(false); if(typeof setViewDetailsOpen!=="undefined")setViewDetailsOpen(false); if(typeof setIsEditOpen!=="undefined")setIsEditOpen(false); if(typeof setIsSettingsOpen!=="undefined")setIsSettingsOpen(false); }catch(e){} } }}><motion.div onClick={e => e.stopPropagation()}'
  );

  // Stop propagation on inner box, and add maxHeight + overflow
  // style={{ background: "var(--cl-bg)", color: "var(--cl-text)", width: "100%", maxWidth: "800px", border: "var(--border-thick)"
  content = content.replace(/(<motion\.div onClick=\{e => e\.stopPropagation\(\)\}.*?style=\{\{[\s\S]*?maxWidth:\s*"[^"]+",?)(\s*maxHeight:\s*"[^"]+",)?(\s*overflowY:\s*"[^"]+",)?([\s\S]*?\}\})/g,
    ' maxHeight: "90vh", overflowY: "auto", overflowX: "hidden", display: "flex", flexDirection: "column",'
  );

  if (content !== oldContent) {
    fs.writeFileSync(file, content);
    console.log("Fixed modals in " + file);
  }
});
