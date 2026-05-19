const fs = require('fs');
const path = require('path');

// Configuration
const SRC_DIR = path.join(__dirname, '..', 'src');
const COMPONENTS_DIR = path.join(__dirname, '..', 'components');
const OUT_DIR = path.join(__dirname, '..');
const DEMOS_DIR = path.join(OUT_DIR, 'demos');
const TOOLS_DIR = path.join(OUT_DIR, 'tools');
const DATA_DIR = path.join(OUT_DIR, 'data');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

// Read components
const header = fs.readFileSync(path.join(COMPONENTS_DIR, 'header.html'), 'utf8');
const footer = fs.readFileSync(path.join(COMPONENTS_DIR, 'footer.html'), 'utf8');

// Build HTML pages
function buildPages() {
  const files = fs.readdirSync(SRC_DIR).filter(f => f.endsWith('.html'));
  for (const file of files) {
    const template = fs.readFileSync(path.join(SRC_DIR, file), 'utf8');
    const output = template
      .replace('{{HEADER}}', header)
      .replace('{{FOOTER}}', footer);
    fs.writeFileSync(path.join(OUT_DIR, file), output);
    console.log(`✅ Built ${file}`);
  }
}

// Generate JSON from folder structure
function generateList(baseDir, type) {
  const items = [];
  if (!fs.existsSync(baseDir)) return items;
  const folders = fs.readdirSync(baseDir).filter(f => {
    const full = path.join(baseDir, f);
    return fs.statSync(full).isDirectory();
  });
  for (const folder of folders) {
    const infoPath = path.join(baseDir, folder, 'info.json');
    let info = {};
    if (fs.existsSync(infoPath)) {
      try {
        info = JSON.parse(fs.readFileSync(infoPath, 'utf8'));
      } catch (e) {
        console.warn(`Invalid JSON in ${infoPath}`);
      }
    }
    const name = info.name || folder.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    const description = info.description || `${type} for VinisTech`;
    const icon = info.icon || (type === 'demo' ? '🚀' : '🛠️');
    const url = `/${type}s/${folder}/index.html`;
    items.push({ name, description, icon, url });
  }
  return items;
}

const demos = generateList(DEMOS_DIR, 'demo');
const tools = generateList(TOOLS_DIR, 'tool');
fs.writeFileSync(path.join(DATA_DIR, 'demos.json'), JSON.stringify(demos, null, 2));
fs.writeFileSync(path.join(DATA_DIR, 'tools.json'), JSON.stringify(tools, null, 2));
console.log(`✅ Generated demos.json (${demos.length}) and tools.json (${tools.length})`);

buildPages();