const fs = require('fs');

const p = 'app/admin/reviews/AdminReviewsClient.jsx';
if (fs.existsSync(p)) {
  let c = fs.readFileSync(p, 'utf8');
  c = c.replace(
    'style={{ background: "var(--cl-bg)", color: "var(--cl-text)", width: "100%", maxWidth: "600px", border: "var(--border-thick)", boxShadow: "var(--shadow-brutal)" }}',
    'data-lenis-prevent="true" style={{ background: "var(--cl-bg)", color: "var(--cl-text)", width: "100%", maxWidth: "600px", maxHeight: "90vh", overflowY: "auto", border: "var(--border-thick)", boxShadow: "var(--shadow-brutal)" }}'
  );
  fs.writeFileSync(p, c);
  console.log('Fixed', p);
}
