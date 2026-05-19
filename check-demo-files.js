const fs = require('fs');
const path = require('path');

const demoPath = path.join(__dirname, 'demos', 'jyotish-demo');
const html = fs.readFileSync(path.join(demoPath, 'index.html'), 'utf8');

// Find all referenced local files (href, src, srcset)
const references = [];
const regex = /(?:href|src|srcset)=["']([^"']+)["']/g;
let match;
while ((match = regex.exec(html)) !== null) {
  let ref = match[1];
  if (!ref.startsWith('http') && !ref.startsWith('//') && !ref.startsWith('#')) {
    references.push(ref);
  }
}

// Check existence
console.log('Checking referenced files in', demoPath);
for (const ref of references) {
  const fullPath = path.join(demoPath, ref);
  if (!fs.existsSync(fullPath)) {
    console.error(`❌ MISSING: ${ref} (expected at ${fullPath})`);
  } else {
    console.log(`✅ OK: ${ref}`);
  }
}