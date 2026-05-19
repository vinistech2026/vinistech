const fs = require('fs');
const path = require('path');

const DEMOS_DIR = path.join(__dirname, 'demos');

function fixHTML(filePath, demoName) {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // 1. Fix href/src attributes
    content = content.replace(/(href|src)=["']([^"']+)["']/g, (match, attr, value) => {
        if (value.startsWith('/') || value.startsWith('http') || value.startsWith('//') ||
            value.startsWith('#') || value.startsWith('tel:') || value.startsWith('mailto:')) return match;
        const absolute = `/demos/${demoName}/${value}`;
        modified = true;
        return `${attr}="${absolute}"`;
    });

    // 2. Fix background-image: url(...)
    content = content.replace(/url\(['"]?(?!\/|http)([^'"\)]+)['"]?\)/g, (match, relPath) => {
        const absolute = `/demos/${demoName}/${relPath}`;
        modified = true;
        return `url('${absolute}')`;
    });

    if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ Fixed HTML: ${path.relative(__dirname, filePath)}`);
    }
}

function fixJS(filePath, demoName) {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Replace "assets/...", 'assets/...', `assets/...` inside strings
    content = content.replace(/(["'`])(assets\/[^"']+)\1/g, (match, quote, assetPath) => {
        if (assetPath.startsWith('/')) return match;
        const absolute = `/demos/${demoName}/${assetPath}`;
        modified = true;
        return `${quote}${absolute}${quote}`;
    });

    if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ Fixed JS: ${path.relative(__dirname, filePath)}`);
    }
}

function processDemo(demoPath) {
    const demoName = path.basename(demoPath);
    const indexFile = path.join(demoPath, 'index.html');
    if (fs.existsSync(indexFile)) {
        fixHTML(indexFile, demoName);
    }

    // Find all .js files in the demo folder (including subfolders)
    const jsFiles = [];
    function walk(dir) {
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
            const full = path.join(dir, entry.name);
            if (entry.isDirectory()) {
                walk(full);
            } else if (entry.isFile() && entry.name.endsWith('.js')) {
                jsFiles.push(full);
            }
        }
    }
    walk(demoPath);
    for (const jsFile of jsFiles) {
        fixJS(jsFile, demoName);
    }
}

const demos = fs.readdirSync(DEMOS_DIR).filter(f =>
    fs.statSync(path.join(DEMOS_DIR, f)).isDirectory()
);
console.log(`🔍 Processing ${demos.length} demos...\n`);
for (const demo of demos) {
    processDemo(path.join(DEMOS_DIR, demo));
}
console.log('\n✅ All demos fixed. Restart server: npx serve .');