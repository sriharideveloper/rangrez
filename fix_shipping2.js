const fs = require('fs');
let file = 'app/admin/shipping/page.js';
let content = fs.readFileSync(file, 'utf8');

content = content.replace('await updateShippingConfig(payload);\\n      setMessage("Configuration saved successfully.");', 
\const res = await updateShippingConfig(payload);
      if (!res.success) throw new Error(res.error);
      setMessage("Configuration saved successfully.");\);

fs.writeFileSync(file, content);
