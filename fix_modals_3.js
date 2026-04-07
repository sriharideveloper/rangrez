const fs = require('fs');
const glob = require('fs').readdirSync('app/admin', { recursive: true }).filter(f=>f.endsWith('.jsx')).map(f => 'app/admin/'+f);

glob.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let oldContent = content;

  // Add click to outside:
  content = content.replace(/background:\s*"rgba\(0,0,0,0\.8\)",[^}]*?padding:\s*"2rem"\s*\}\}>(\s*)<motion\.div/g, 
    'background: "rgba(0,0,0,0.8)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }} onClick={(e) => { if(e.target===e.currentTarget) { try{ if(typeof setIsFormOpen==="function")setIsFormOpen(false); if(typeof setIsBulkOpen==="function")setIsBulkOpen(false); if(typeof setViewDetailsOpen==="function")setViewDetailsOpen(false); if(typeof setIsEditOpen==="function")setIsEditOpen(false); if(typeof setIsSettingsOpen==="function")setIsSettingsOpen(false); }catch(e){} } }}><motion.div onClick={e => e.stopPropagation()}'
  );

  content = content.replace(/<motion\.div onClick=\{e => e\.stopPropagation\(\)\}.*?maxWidth:\s*"([^"]+)",([^}]+)\}\}/g, 
    (match, maxWidth, rest) => {
      // Avoid inserting duplicates
      if (rest.includes("maxHeight")) return match;
      return match.replace(maxWidth + '",', maxWidth + '", maxHeight: "90vh", overflowY: "auto", overflowX: "hidden", display: "flex", flexDirection: "column",');
    }
  );

  if (content !== oldContent) {
    fs.writeFileSync(file, content);
    console.log("Fixed modals in " + file);
  }
});
