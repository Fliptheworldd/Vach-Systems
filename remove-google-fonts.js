const fs = require('fs');
const path = require('path');

// Alle HTML-Dateien finden (root + blog/)
const htmlFiles = [
    'leistungen.html',
    'loesungen.html',
    'ueber-uns.html',
    'kontakt.html',
    'impressum.html',
    'datenschutz.html',
    'projekte.html',
    ...fs.readdirSync('blog').filter(f => f.endsWith('.html')).map(f => `blog/${f}`)
];

let totalFixed = 0;

htmlFiles.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (!fs.existsSync(filePath)) {
        console.log(`⚠️  Skip: ${file} (not found)`);
        return;
    }
    
    let content = fs.readFileSync(filePath, 'utf-8');
    const originalLength = content.length;
    
    // Entferne Google Fonts preconnect
    content = content.replace(/<link rel="preconnect" href="https:\/\/fonts\.googleapis\.com">\s*/g, '');
    content = content.replace(/<link rel="preconnect" href="https:\/\/fonts\.gstatic\.com" crossorigin>\s*/g, '');
    
    // Entferne Google Fonts stylesheet (mit media trick)
    content = content.replace(/<link href="https:\/\/fonts\.googleapis\.com\/css2\?family=Inter[^>]+>/g, '');
    
    // Entferne noscript fallback
    content = content.replace(/<noscript><link href="https:\/\/fonts\.googleapis\.com[^>]+><\/noscript>\s*/g, '');
    
    if (content.length !== originalLength) {
        fs.writeFileSync(filePath, content, 'utf-8');
        console.log(`✅ Fixed: ${file} (${originalLength - content.length} chars removed)`);
        totalFixed++;
    } else {
        console.log(`✓  Clean: ${file}`);
    }
});

console.log(`\n🎉 Done! Fixed ${totalFixed} files.`);
