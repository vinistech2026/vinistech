const fs = require('fs');
const path = require('path');

// Directories
const DEMOS_DIR = path.join(__dirname, '..', 'demos');
const TOOLS_DIR = path.join(__dirname, '..', 'tools');
const DATA_DIR = path.join(__dirname, '..', 'data');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function readInfoFile(folderPath) {
  const infoPath = path.join(folderPath, 'info.json');
  if (fs.existsSync(infoPath)) {
    try {
      return JSON.parse(fs.readFileSync(infoPath, 'utf8'));
    } catch (e) {
      console.warn(`Invalid JSON in ${infoPath}`, e);
    }
  }
  return null;
}

function generateList(baseDir, type) {
  const items = [];
  const folders = fs.readdirSync(baseDir).filter(f => {
    const fullPath = path.join(baseDir, f);
    return fs.statSync(fullPath).isDirectory();
  });

  for (const folder of folders) {
    const folderPath = path.join(baseDir, folder);
    const info = readInfoFile(folderPath) || {};
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

console.log(`✅ Generated demos.json (${demos.length} items) and tools.json (${tools.length} items)`);