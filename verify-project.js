const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = __dirname;
const MAIN_PAGES = ['index.html', 'about.html', 'services.html', 'contact.html', 'careers.html', 'demo.html', 'tools.html', 'blog.html'];
const GLOBAL_ASSETS = ['assets/logo.png', 'assets/hero-bg.png', 'assets/facebook.png', 'assets/twitter.png', 'assets/instagram.png', 'css/style.css', 'js/global.js', 'js/pages/demo.js', 'js/pages/tools.js', 'js/pages/blog.js', 'data/demos.json', 'data/tools.json', 'data/blogs.json'];

let issues = [];

function logIssue(type, file, message) {
    issues.push({ type, file, message });
}

function fileExists(filePath) {
    return fs.existsSync(filePath);
}

function isAbsolutePath(attr) {
    return attr.startsWith('/') && !attr.startsWith('//');
}

function checkMainPages() {
    console.log('\n📄 Checking main pages...');
    for (const page of MAIN_PAGES) {
        const pagePath = path.join(PROJECT_ROOT, page);
        if (!fileExists(pagePath)) {
            logIssue('MISSING', page, 'Main page file not found');
            continue;
        }
        const content = fs.readFileSync(pagePath, 'utf8');
        // Check for absolute paths (starting with /)
        const absoluteMatches = content.match(/(?:href|src)=["'](\/[^"']+)["']/g);
        if (absoluteMatches) {
            absoluteMatches.forEach(match => {
                const attr = match.match(/["']([^"']+)["']/)[1];
                if (!attr.startsWith('//') && !attr.startsWith('/assets/') && !attr.startsWith('/css/') && !attr.startsWith('/js/') && !attr.startsWith('/data/')) {
                    logIssue('ABSOLUTE_PATH', page, `Found absolute path: ${attr}`);
                }
            });
        }
    }
}

function checkGlobalAssets() {
    console.log('\n📦 Checking global assets...');
    for (const asset of GLOBAL_ASSETS) {
        const fullPath = path.join(PROJECT_ROOT, asset);
        if (!fileExists(fullPath)) {
            logIssue('MISSING', asset, 'Global asset missing');
        }
    }
}

function checkDemo(demoPath) {
    const indexFile = path.join(demoPath, 'index.html');
    if (!fileExists(indexFile)) return;

    const content = fs.readFileSync(indexFile, 'utf8');
    const demoName = path.basename(demoPath);

    // Find all local references (href, src, srcset)
    const references = [];
    const regex = /(?:href|src|srcset)=["']([^"']+)["']/g;
    let match;
    while ((match = regex.exec(content)) !== null) {
        let ref = match[1];
        // Ignore external URLs, anchors, data URLs, etc.
        if (ref.startsWith('http') || ref.startsWith('//') || ref.startsWith('data:') || ref.startsWith('#')) continue;
        references.push(ref);
    }

    for (const ref of references) {
        // Check for absolute paths inside demo (should be relative)
        if (isAbsolutePath(ref)) {
            logIssue('ABSOLUTE_PATH', `${demoName}/index.html`, `Absolute path inside demo: ${ref}`);
            continue;
        }
        // Resolve relative to demo folder
        const fullRef = path.join(demoPath, ref);
        if (!fileExists(fullRef)) {
            // Check for case‑sensitive mismatch
            const dir = path.dirname(fullRef);
            const fileName = path.basename(fullRef);
            if (fs.existsSync(dir)) {
                const files = fs.readdirSync(dir);
                const lowerFiles = files.map(f => f.toLowerCase());
                if (lowerFiles.includes(fileName.toLowerCase())) {
                    const correctName = files.find(f => f.toLowerCase() === fileName.toLowerCase());
                    logIssue('CASE_MISMATCH', `${demoName}/index.html`, `Referenced "${fileName}" but actual file is "${correctName}"`);
                } else {
                    logIssue('MISSING', `${demoName}/index.html`, `Referenced file not found: ${ref}`);
                }
            } else {
                logIssue('MISSING', `${demoName}/index.html`, `Referenced file not found: ${ref}`);
            }
        }
    }
}

function checkAllDemos() {
    const demosDir = path.join(PROJECT_ROOT, 'demos');
    if (!fs.existsSync(demosDir)) {
        logIssue('MISSING', 'demos folder', 'No demos folder found');
        return;
    }
    const demoFolders = fs.readdirSync(demosDir).filter(f => fs.statSync(path.join(demosDir, f)).isDirectory());
    console.log(`\n🎯 Checking ${demoFolders.length} demos...`);
    for (const folder of demoFolders) {
        const demoPath = path.join(demosDir, folder);
        console.log(`   - ${folder}`);
        checkDemo(demoPath);
    }
}

function printReport() {
    console.log('\n' + '='.repeat(60));
    console.log('VERIFICATION REPORT');
    console.log('='.repeat(60));
    if (issues.length === 0) {
        console.log('✅ No issues found. Your project is clean!');
    } else {
        const grouped = issues.reduce((acc, issue) => {
            if (!acc[issue.type]) acc[issue.type] = [];
            acc[issue.type].push(issue);
            return acc;
        }, {});
        for (const [type, items] of Object.entries(grouped)) {
            console.log(`\n❌ ${type} (${items.length}):`);
            items.forEach(item => {
                console.log(`   - ${item.file}: ${item.message}`);
            });
        }
        console.log('\n⚠️  Please fix the above issues before deploying.');
    }
    console.log('='.repeat(60));
}

// Main execution
console.log('🔍 Starting project verification...');
checkMainPages();
checkGlobalAssets();
checkAllDemos();
printReport();