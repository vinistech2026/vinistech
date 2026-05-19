const fs = require('fs');
const path = require('path');

const DEMOS_DIR = path.join(__dirname, 'demos');

// List of file extensions to treat as assets (can be extended)
const assetExtensions = ['.css', '.js', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.ico'];

function isAssetFile(ref) {
    // Ignore external URLs, anchors, telephone links, emails, etc.
    if (ref.startsWith('http') || ref.startsWith('//') || ref.startsWith('data:') ||
        ref.startsWith('#') || ref.startsWith('tel:') || ref.startsWith('mailto:')) {
        return false;
    }
    // Check if the reference looks like an asset (has an extension or is an asset folder)
    const ext = path.extname(ref).toLowerCase();
    if (assetExtensions.includes(ext)) return true;
    // Also treat known asset folders (like assets/, css/, js/) without extension
    if (ref.startsWith('assets/') || ref.startsWith('css/') || ref.startsWith('js/')) return true;
    return false;
}

function fixDemo(demoPath) {
    const indexFile = path.join(demoPath, 'index.html');
    if (!fs.existsSync(indexFile)) return;

    let content = fs.readFileSync(indexFile, 'utf8');
    const demoName = path.basename(demoPath);
    let modified = false;

    // Replace relative paths (href="style.css") with absolute paths (href="/demos/jyotish-demo/style.css")
    // This regex matches href="..." or src="..." where the value is not already absolute (/ or http)
    const regex = /(href|src)=["']([^"']+)["']/g;
    content = content.replace(regex, (match, attr, value) => {
        // Skip if already absolute (starts with / or http)
        if (value.startsWith('/') || value.startsWith('http') || value.startsWith('//') ||
            value.startsWith('#') || value.startsWith('tel:') || value.startsWith('mailto:')) {
            return match;
        }
        // Skip if not an asset file (like links to other pages)
        if (!isAssetFile(value)) return match;

        // Build absolute path: /demos/demoName/value
        const absolutePath = `/demos/${demoName}/${value}`;
        modified = true;
        return `${attr}="${absolutePath}"`;
    });

    if (modified) {
        fs.writeFileSync(indexFile, content, 'utf8');
        console.log(`✅ Fixed: ${demoName}/index.html`);
    } else {
        console.log(`⏭️  No changes needed: ${demoName}/index.html`);
    }
}

// Process all demo folders
if (!fs.existsSync(DEMOS_DIR)) {
    console.error('❌ demos folder not found! Make sure you are in the project root.');
    process.exit(1);
}

const demoFolders = fs.readdirSync(DEMOS_DIR).filter(f =>
    fs.statSync(path.join(DEMOS_DIR, f)).isDirectory()
);

console.log(`🔍 Found ${demoFolders.length} demo folders.\n`);
for (const folder of demoFolders) {
    const demoPath = path.join(DEMOS_DIR, folder);
    fixDemo(demoPath);
}
console.log('\n✅ All demos processed.');